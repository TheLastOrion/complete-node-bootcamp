/* eslint-disable */
import axios from 'axios';

exports.login = async (email, password) => {
  console.log (email + '  ' + password)
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email: email,
        password: password,
      }
    });
    if(res.data.status === 'success') {
      alert('Logged in successfully!');
      window.setTimeout(()=> {
        location.assign('/');
      }, 1500)
    }
    console.log(res);
  }
  catch (err)
  {
    alert(err.response.data.message);
  }
};
