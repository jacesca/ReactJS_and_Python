import axios from "axios";
import { 
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,

  USER_LOGOUT,

  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,

  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,

  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,

  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,

  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,

  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_RESET,
} from '../constants/userConstants'
import { 
  CART_RESET_ITEM 
} from '../constants/cartConstants'
import { 
  USER_ENDPOINT, 
  TOKEN_ENDPOINT, 
  CURRENTUSER_ENDPOINT 
} from '../constants/apiConstants'
import { 
  ORDER_CREATE_RESET, 
  ORDER_LIST_RESET, 
  ORDER_DELIVER_RESET, 
} from '../constants/orderConstants'
import { 
  PRODUCT_CREATE_RESET, 
  PRODUCT_UPDATE_RESET, 
  PRODUCT_IMAGE_UPLOAD_RESET,
  PRODUCT_REVIEW_CREATE_RESET,
} from '../constants/productConstants'


export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST })
    const config = { headers:{ 
      'Content-Type': 'application/json'
    } }
    const { data } = await axios.post(
      `${TOKEN_ENDPOINT}/`,
      {
        'username': email, 
        'password': password
      },
      config
    )

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: USER_LOGIN_FAIL, 
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    })  
  }
}


export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('shippingAddress')
  localStorage.removeItem('cartItems')
  localStorage.removeItem('paymentMethod')
  dispatch({ type: USER_LOGOUT })
  dispatch({ type: USER_DETAILS_RESET })
  dispatch({ type: USER_UPDATE_PROFILE_RESET })
  dispatch({ type: USER_LIST_RESET })
  dispatch({ type: USER_UPDATE_RESET })
  dispatch({ type: CART_RESET_ITEM })
  dispatch({ type: ORDER_CREATE_RESET })
  dispatch({ type: ORDER_LIST_RESET })
  dispatch({ type: PRODUCT_CREATE_RESET })
  dispatch({ type: PRODUCT_UPDATE_RESET })
  dispatch({ type: PRODUCT_IMAGE_UPLOAD_RESET })
  dispatch({ type: ORDER_DELIVER_RESET })
  dispatch({ type: PRODUCT_REVIEW_CREATE_RESET })
}


export const register = (firstname, lastname, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST })
    const config = { headers:{ 
      'Content-Type': 'application/json'
    } }
    const { data } = await axios.post(
      `${USER_ENDPOINT}/`,
      {
        'username': email, 
        'email': email,
        'first_name': firstname,
        'last_name': lastname,
        'password': password
      },
      config
    )

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: USER_REGISTER_FAIL, 
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    })  
  }
}


export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`
      }
    }
    const endpoint = id === 'profile' ? `${CURRENTUSER_ENDPOINT}/` : `${USER_ENDPOINT}/${id}/`;
    const { data } = await axios.get(endpoint, config)
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data })

  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: USER_DETAILS_FAIL, 
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    })  
  }
}


export const updateUserProfile = (id, user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`
      }
    }
    const { data } = await axios.put( `${USER_ENDPOINT}/${id}/`, user, config )
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
  
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: USER_UPDATE_PROFILE_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  
  }
}


export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`
      }
    }
    const { data } = await axios.get( `${USER_ENDPOINT}/`, config )
    dispatch({ type: USER_LIST_SUCCESS, payload: data })
      
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: USER_LIST_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  }
}


export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`
      }
    }
    const { data } = await axios.delete( `${USER_ENDPOINT}/${id}/`, config )
    dispatch({ type: USER_DELETE_SUCCESS, payload: data })
      
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: USER_DELETE_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  }
}


export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`
      }
    }
    const { data } = await axios.patch(`${USER_ENDPOINT}/${user.id}/`, user, config )
    dispatch({ type: USER_UPDATE_SUCCESS })
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data  })
      
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: USER_UPDATE_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  }
}
