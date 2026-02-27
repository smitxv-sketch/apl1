fetch('http://localhost:3000/api/cars')
  .then(res => res.text())
  .then(text => console.log('Content:', text))
  .catch(err => console.error(err));
