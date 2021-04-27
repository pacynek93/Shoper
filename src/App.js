import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.scss';

const App = () => {
  const cors = 'https://thingproxy.freeboard.io/fetch/'
  const [products, setProducts] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  const getAccessToken = () => {
    axios.post(`${cors}https://devshop-376948.shoparena.pl/webapi/rest/auth`, {}, {
      auth: {
        username: 'webapi',
        password: 'Webapi4321;',
      },
    })
      .then(res => {
        setAccessToken(res.data.access_token);
      });
  };

  const getProducts = () => {
    axios.get(`${cors}https://devshop-376948.shoparena.pl/webapi/rest/products?page=1&limit=16`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(response => {
        setProducts(response.data.list);
      });
  };

  const sortedUsers = () => products.sort((a, b) => {
    const result = a.translations.pl_PL.name.localeCompare(b.translations.pl_PL.name);

    return result !== 0 ? result : a.translations.pl_PL.name.localeCompare(b.translations.pl_PL.name);
  });

  sortedUsers();

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    accessToken && getProducts();
  }, [accessToken]);


  const formatDate = () => {
    const formatData = new Date();
    formatData.setSeconds(0, 0);
    return formatData.toISOString().replace(/T/, ' ').replace(/:00.000Z/, '');
  }

  const mapProducts = () => products.map(item => (
    <a key={item.product_id} rel="noreferrer" target="_blank" href={item.translations.pl_PL.permalink}>
      <div className="singleTile">
        <img src="https://via.placeholder.com/250" alt={item.translations.pl_PL.name} />
        <div>Prod Id: {item.product_id}</div>
        <div>{item.translations.pl_PL.name}</div>
        <div dangerouslySetInnerHTML={{ __html: item.translations.pl_PL.short_description }} className='singleTileItem' />
        <div className="price">Price: {item.stock.price}</div>
        <div>Cat Id: {item.category_id}</div>
        <div>{formatDate(item.add_date)}</div>
      </div>
    </a>
  ));

  return (
    <>
      <div className="contentWrapper">{mapProducts()}</div>
    </>
  );
};

export default App;
