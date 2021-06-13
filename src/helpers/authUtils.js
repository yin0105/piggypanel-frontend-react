import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

class FirebaseAuthBackend {
  constructor(firebaseConfig) {
    if (firebaseConfig) {
      // Initialize Firebase
      //firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          sessionStorage.setItem("authUser", JSON.stringify(user));
        } else {
          sessionStorage.removeItem("authUser");
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          user => {
            resolve(firebase.auth().currentUser);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/rest-auth/authenticate/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username: email, password: password })
      })
      .then( 
        res => res.json()
      )
      .then( 
        res=>  {  
          console.log("res = ", res)        ;
          if( res.key) {
            if(res.is_superuser){
              resolve(
                sessionStorage.setItem("authUser", JSON.stringify(res.key)),
                sessionStorage.setItem('authName', JSON.stringify(res.authName)),
                sessionStorage.setItem('username', JSON.stringify(res.username)),
                sessionStorage.setItem('authId', JSON.stringify(res.id)),
                sessionStorage.setItem('access', 'superuser')
              );
            } else if(res.group.length > 0){
              resolve(                
                sessionStorage.setItem("authUser", JSON.stringify(res.key)),
                sessionStorage.setItem('authName', JSON.stringify(res.authName)),
                sessionStorage.setItem('username', JSON.stringify(res.username)),
                sessionStorage.setItem('authId', JSON.stringify(res.id)),
                sessionStorage.setItem('access', res.group[0].toLowerCase())
              );
            } else {
              reject("Unauthorized access!"); 
            }
            // axios.defaults.params = {}
            // axios.defaults.params['user'] = JSON.stringify(res.authName);
          } else 
            reject(res.non_field_errors[0]);
        },
        error => {
          console.log("Error");
          reject(this._handleError(error));
        }        
      )
      .catch( error => console.log(error))
    });    
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = email => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/rest-auth/password/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email: email })
      })
      .then( 
        res => res.json()
      )
      .then(
        res=>  {
          console.log(res.detail)
          resolve(true)
        }
      )
      .catch( error => console.log(error))
      /*firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url: window.location.protocol + "//" + window.location.host + "/login"
        })
        .then(() => {
          console.log("yes authutils");
          resolve(true);
        })
        .catch(error => {   
          reject(this._handleError(error));
        });*/
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      // firebase
      //   .auth()
      //   .signOut()
      //   .then(() => {
      //     resolve(true);
      //   })
      //   .catch(error => {
      //     reject(this._handleError(error));
      //   });
      sessionStorage.clear();
      resolve(true)
    });
  };

  setLoggeedInUser = user => {
    sessionStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!sessionStorage.getItem("authUser")) return null;
    //console.log(sessionStorage.getItem("authUser"))
    //console.log(sessionStorage.getItem("authName"))
    return JSON.parse(sessionStorage.getItem("authUser"));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = config => {
  if (!_fireBaseBackend) {
    //_fireBaseBackend = new FirebaseAuthBackend(config);
    _fireBaseBackend = new FirebaseAuthBackend();
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
