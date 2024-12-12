import { useContext } from 'react';
import AppContext from "../../context/AppContext";
import Cards from './Cards';

const ShowProduct = () => {
  const { products ,searchFilter } = useContext(AppContext); 
  if (!products) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch ;
  });

  return <Cards products={filteredProducts} />;
};

export default ShowProduct;
