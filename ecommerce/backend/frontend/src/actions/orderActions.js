import axios from "axios";
import { 
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,

  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,

  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,

  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,

  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
} from '../constants/orderConstants'
import { ORDER_ENDPOINT } from '../constants/apiConstants'
import { CART_RESET_ITEM } from '../constants/cartConstants'


export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST })
    
    const { userLogin: { userInfo } } = getState()
    const config = { headers:{ 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.access}` 
    } }    
    const endpoint = `${ORDER_ENDPOINT}/`;
    const { data } = await axios.post(endpoint, order, config)

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data })
    dispatch({ type: CART_RESET_ITEM, payload: data })

    localStorage.removeItem('cartItems')
  
  } catch (error) {
    console.log(error.response.data)
    dispatch({ type: ORDER_CREATE_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message })
  }
}


export const getOrderDetails = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST })
    
    const { userLogin: { userInfo } } = getState()
    const config = { headers:{ 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.access}`
    } }    
    const { data } = await axios.get(`${ORDER_ENDPOINT}/${orderId}/`, config)

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data })  
  } catch (error) {
    console.log(error.response.data)
    dispatch({ type: ORDER_DETAILS_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message })
  }
}


export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST })
    
    const { userLogin: { userInfo } } = getState()
    const config = { headers:{ 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${userInfo.access}` 
    } }    
    const { data } = await axios.patch(`${ORDER_ENDPOINT}/${orderId}/`, paymentResult, config)

    dispatch({ type: ORDER_PAY_SUCCESS, payload: data })
  } catch (error) {
    console.log(error.response.data)
    dispatch({ type: ORDER_PAY_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message })
  }
}


export const deliverOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELIVER_REQUEST })
    
    const { userLogin: { userInfo } } = getState()
    const config = { headers:{ 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${userInfo.access}` 
    } }    
    const { data } = await axios.patch(`${ORDER_ENDPOINT}/${orderId}/`, { "isDelivered": true }, config)

    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data })
  } catch (error) {
    console.log(error.response.data)
    dispatch({ type: ORDER_DELIVER_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message })
  }
}


export const getOrderList = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST })
    
    const { userLogin: { userInfo } } = getState()
    const config = { 
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${userInfo.access}` 
      },
      params: ( userId
                ? { "user_id": userId }
                : {}
              )
    }  
    const { data } = await axios.get(`${ORDER_ENDPOINT}/`, config)

    dispatch({ type: ORDER_LIST_SUCCESS, payload: data })  
  } catch (error) {
    console.log(error.response.data)
    dispatch({ type: ORDER_LIST_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message })
  }
}


// export const getOrderCalculations = (totalPrice) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ORDER_CALCULATIONS_REQUEST })

//     const {
//       userLogin: { userInfo } 
//     } = getState()

//     const config = {
//       headers:{
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${userInfo.access}`
//       }
//     }
    
//     const endpoint = `${ORDER_CALCULATIONS_ENDPOINT}/?totalPrice=${totalPrice}`;
//     const { data } = await axios.get(endpoint, config)

//     dispatch({ type: ORDER_CALCULATIONS_SUCCESS, payload: data })
//     // localStorage.setItem('orderCalculatedAmount', JSON.stringify(data))
  
//   } catch (error) {
//     console.log(error.response.data)
//     dispatch({ 
//       type: ORDER_CALCULATIONS_FAIL, 
//       payload: error.response && error.response.data.detail 
//       ? error.response.data.detail
//       : error.message
//     })
  
//   }
// }
