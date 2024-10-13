
const email = RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
const password = RegExp('^(?=.*[A-Z])(?=.*\d).{8,}$');
 
export {email, password}   