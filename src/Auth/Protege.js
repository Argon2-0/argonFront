import { AES, enc, mode, pad } from 'crypto-js';
var Protege = (data) => {
    var key = enc.Latin1.parse('ab4q8g6j5j7o5s63');
    
    var iv   = enc.Latin1.parse('8q7d4g86s2f4h26s');  
    var encrypted = AES.encrypt(data, key, {iv:iv,mode:mode.CBC,padding:pad.ZeroPadding});
    return Promise.resolve(encrypted);
  }

  
export default Protege;
