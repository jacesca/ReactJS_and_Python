import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { 
  productListReducer, 
  productDetailsReducer, 
  productDeleteReducer, 
  productCreateReducer, 
  productUpdateReducer, 
  productImageUploadReducer ,
  productReviewCreateReducer,
  productTopReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { 
  userLoginReducer, 
  userRegisterReducer, 
  userDetailsReducer, 
  userUpdateProfileReducer,
  userListReducer, 
  userDeleteReducer, 
  userUpdateReducer, 
} from './reducers/userReducers'
import { 
  orderCreateReducer, 
  orderDetailsReducer, 
  orderPayReducer,
  orderListReducer, 
  orderDeliverReducer, 
} from './reducers/orderReducers'


const reducer = combineReducers({
  productList: productListReducer,
  productTop: productTopReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productImageUpload: productImageUploadReducer,
  productReviewCreate: productReviewCreateReducer,

  cart: cartReducer,
  
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  
  // orderCalulations: orderCalulationsReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,
})


///////////////////////////////////////////////////////////////////
const userInfoFromStorage = localStorage.getItem('userInfo') ?
  JSON.parse(localStorage.getItem('userInfo')) : null


///////////////////////////////////////////////////////////////////
const cartItemsFromStorage = localStorage.getItem('cartItems') ?
  JSON.parse(localStorage.getItem('cartItems')) : []


///////////////////////////////////////////////////////////////////
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
  JSON.parse(localStorage.getItem('shippingAddress')) : {}


///////////////////////////////////////////////////////////////////
const middleware = [thunk]

const initialState = {
  cart: { 
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage, 
  },
  userLogin: { userInfo: userInfoFromStorage },
}

const store = createStore(
  reducer, 
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store