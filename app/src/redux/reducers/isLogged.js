// EXAMPLE FILE FROM THE REDUX TUTORIAL

const loggedReducer = (state = false, action) => {
    switch(action.type){
        case 'SIGN_IN':
            return !state;
        default:
            return state;
    }
}
export default loggedReducer;