import axios from "axios";
import { 
  PRODUCT_LIST_REQUEST, 
  PRODUCT_LIST_SUCCESS, 
  PRODUCT_LIST_FAIL, 

  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  
  PRODUCT_IMAGE_UPLOAD_REQUEST,
  PRODUCT_IMAGE_UPLOAD_SUCCESS,
  PRODUCT_IMAGE_UPLOAD_FAIL,
  
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,

  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from '../constants/productConstants'
import { 
  PRODUCT_ENDPOINT, 
  UPLOAD_ENDPOINT, 
  REVIEW_ENDPOINT, 
  PRODUCT_TOP_ENDPOINT,
} from '../constants/apiConstants'


export const listProducts = (keywords='') => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })
    // const params = (page ? `page=${page}&` : '') + (search ? `search=${search}` : '') 
    const { data } = await axios.get(`${PRODUCT_ENDPOINT}/${keywords}`)
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data })
  
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_LIST_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  
  }
}


export const topProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST })
    const { data } = await axios.get(`${PRODUCT_TOP_ENDPOINT}/`)
    dispatch({ type: PRODUCT_TOP_SUCCESS, payload: data })
  
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_TOP_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  
  }
}


export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })
    const { data } = await axios.get(`${PRODUCT_ENDPOINT}/${id}/`)
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_DETAILS_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  }
}


export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = { headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.access}`
    } }
    const { data } = await axios.delete( `${PRODUCT_ENDPOINT}/${id}/`, config )
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data })
      
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_DELETE_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  }
}


export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = { headers:{ 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.access}` 
    } }
    const { data } = await axios.post(`${PRODUCT_ENDPOINT}/`, {}, config)

    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data })
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_CREATE_FAIL, 
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    })  
  }
}
// export const createProduct = (name, brand, category, description, price, countInStock) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: PRODUCT_CREATE_REQUEST })
//     const { userLogin: { userInfo } } = getState()
//     const config = { 
//       headers:{ 
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${userInfo.access}` 
//       } 
//     }
//     const { data } = await axios.post(
//       `${PRODUCT_ENDPOINT}/`,
//       {
//         'name': name, 
//         'brand': brand,
//         'category': category,
//         'description': description,
//         'price': price,
//         'countInStock': countInStock
//       },
//       config
//     )

//     dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data })
//   } catch (error) {
//     console.log(error.response.data)
//     dispatch({ 
//       type: PRODUCT_CREATE_FAIL, 
//       payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
//     })  
//   }
// }


export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.access}`
      }
    }
    const { data } = await axios.patch(`${PRODUCT_ENDPOINT}/${product._id}/`, product, config )
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data })
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
      
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_UPDATE_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  }
}


export const uploadProductImage = (file, productId) => async (dispatch, getState) => {
  try { 
    const formData = new FormData()
    formData.append("image", file)
    formData.append("product_id", productId)

    dispatch({ type: PRODUCT_IMAGE_UPLOAD_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = { 
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.access}`
      }
    }

    const { data } = await axios.post(`${UPLOAD_ENDPOINT}/`, formData, config)
    dispatch({ type: PRODUCT_IMAGE_UPLOAD_SUCCESS, payload: data })
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_IMAGE_UPLOAD_FAIL, 
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    })
  }
}


export const createReview = (review) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_REVIEW_CREATE_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = { headers:{ 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.access}` 
    } }
    const { data } = await axios.post(`${REVIEW_ENDPOINT}/`, review, config)

    dispatch({ type: PRODUCT_REVIEW_CREATE_SUCCESS, payload: data })
  } catch (error) {
    console.log(error.response.data)
    dispatch({ 
      type: PRODUCT_REVIEW_CREATE_FAIL, 
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    })  
  }
}
