const feedUrl = 'https://media.cm.expert/stock/export/cmexpert/dealer.site/all/all/f1be278e279b7dea06e6aee198c21696.xml';
fetch(feedUrl)
  .then(res => {
    console.log('Status:', res.status);
    return res.text();
  })
  .then(text => console.log('Length:', text.length))
  .catch(err => console.error(err));
