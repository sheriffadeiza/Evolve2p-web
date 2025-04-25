
import React from 'react';
import Signup from './Signup/page';
import Password from './Password/page';
import VerifyEmail from './VerifyEmail/page';
import Profile from './Profile/page';
import Secpin from './Lsecpin/page'
import Login from './login/page';
import Lsecpin from './Lsecpin/page';
import Lauth from './Lauth/page';
import Resetp from './Resetp/page';
import Lverify from './Lverify/page';
import Lpass from './Lpass/page';
import Sconfirm from './Sconfirm/page';



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
