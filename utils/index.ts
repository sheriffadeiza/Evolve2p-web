export function formatHashOrAddress(
  value: string,
  visibleChars: number = 6
): string {
  if (!value || typeof value !== "string") return "";

  // If it's shorter than twice the visible chars, return as is
  if (value.length <= visibleChars * 2) return value;

  const prefix = value.slice(0, visibleChars);
  const suffix = value.slice(-visibleChars);

  return `${prefix}...${suffix}`;
}

type CoinSymbol = "BTC" | "ETH" | "USDT" | "USDC";

interface CoinInfo {
  usd: number;
  btc: number;
  eth: number;
}

export interface CoinDataMap {
  [key: string]: CoinInfo;
}

/**
 * Fetches latest coin prices from CoinPaprika and returns a CoinDataMap.
 */
export async function fetchCoinData(): Promise<CoinDataMap | null> {
  const symbolToId: Record<string, string> = {
    bitcoin: "btc-bitcoin",
    ethereum: "eth-ethereum",
    tether: "usdt-tether",
    "usd-coin": "usdc-usd-coin",
  };

  try {
    // Fetch USD prices for all supported coins
    const entries = await Promise.all(
      Object.entries(symbolToId).map(async ([key, id]) => {
        const res = await fetch(`https://api.coinpaprika.com/v1/tickers/${id}`);
        const data = await res.json();
        return [key, parseFloat(data.quotes.USD.price)];
      })
    );

    const usdPrices = Object.fromEntries(entries);
    const btcPrice = usdPrices.bitcoin;
    const ethPrice = usdPrices.ethereum;

    const formattedPrices: CoinDataMap = {};

    for (const key in usdPrices) {
      const usd = usdPrices[key];
      formattedPrices[key] = {
        usd,
        btc: parseFloat((usd / btcPrice).toFixed(8)),
        eth: parseFloat((usd / ethPrice).toFixed(8)),
      };
    }

    // Set 1 for base units
    formattedPrices.bitcoin.btc = 1;
    formattedPrices.ethereum.eth = 1;

    return formattedPrices as CoinDataMap;
  } catch (error) {
    console.error("❌ Failed to fetch coin prices:", error);
    return null;
  }
}

/**
 * Get coin data safely using a switch-case symbol mapper.
 */
export function getCoinData(
  symbol: string,
  coinData?: CoinDataMap
): CoinInfo | { error: true; message: string } {
  if (!symbol) return { error: true, message: "Symbol is required" };
  if (!coinData) return { error: true, message: "Coin data is undefined" };

  let key: string;

  switch (symbol.toUpperCase()) {
    case "BTC":
      key = "bitcoin";
      break;
    case "ETH":
      key = "ethereum";
      break;
    case "USDT":
      key = "tether";
      break;
    case "USDC":
      key = "usd-coin";
      break;
    default:
      key = symbol.toLowerCase();
  }

  const data = coinData[key];
  return (
    data || { error: true, message: `No data found for symbol "${symbol}"` }
  );
}

export function convertCoinValue(
  fromSymbol: string,
  toSymbol: string,
  amount: number,
  coinData?: CoinDataMap
): number | { error: true; message: string } {
  const fromData = getCoinData(fromSymbol, coinData);
  const toData = getCoinData(toSymbol, coinData);

  if ("error" in fromData) return fromData;
  if ("error" in toData) return toData;

  // Convert through USD as a base reference
  const usdValue = amount * fromData.usd;
  const converted = usdValue / toData.usd;

  return parseFloat(converted.toFixed(8));
}
