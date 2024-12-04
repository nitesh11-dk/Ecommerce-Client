import { useContext } from 'react';
import AppContext from "../../context/AppContext";
import Cards from './Cards';

const ShowProduct = () => {
  const { products  } = useContext(AppContext);

  if (!products) {
    return <div>Loading...</div>;
  }

  return <Cards products={products} />;
};

export default ShowProduct;
