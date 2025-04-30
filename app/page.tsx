
import React from 'react';
import Signup from './Signups/Email/page';
import Password from './Signups/Password/page';
import VerifyEmail from './Signups/VerifyEmail/page';
import Profile from './Signups/Profile/page';
import Secpin from './Lsecpin/page'
import Login from './login/page';
import Lsecpin from './Lsecpin/page';
import Lauth from './Lauth/page';
import Resetp from './Resetp/page';
import Lverify from './Lverify/page';
import Lpass from './Lpass/page';
import Sconfirm from './Signups/Sconfirm/page';



export default function Home() {
  return (
   <div  >
     {/* for signup page */}
    <div>
    <Signup /> 
    <Password />  
    <VerifyEmail />
    <Profile/>
    <Secpin/>
    <Sconfirm/>
    </div>

    <div>
      {/* for Login page */}

      <Login />
      <Lsecpin/>
      <Lauth />
      <Resetp/>
      <Lverify/>
      <Lpass/>
      

    </div>
    
    </div>
    
       
  );
}
