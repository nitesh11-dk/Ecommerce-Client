import React, { useContext, useEffect, useState } from 'react'
import AppContext from "../../context/AppContext";
import Cards from './Cards'

const RelatedProduct = ({ category, productId }) => {
  const [relatedProduct, setRelatedProduct] = useState([])

  const { products } = useContext(AppContext)

  useEffect(() => {
    const filterProduct = products.filter(
      (product) => product?.category?.toLowerCase() === category?.toLowerCase() && product._id !== productId
    )
    setRelatedProduct(filterProduct)
  }, [category, productId, products])

  return (
    <div className='text-white '>
      <h2 className='text-center text-2xl tracking-wider font-bold mb-4'>Related Products</h2>
      <Cards products={relatedProduct} />
    </div>
  )
}

export default RelatedProduct
