// Fetch data from the API
fetch('https://api.coinranking.com/v2/coins')
  .then(response => response.json())
  .then(data => {
    const tbody = document.getElementById('data-body');
    const searchInput = document.getElementById('search_name');
    const searchButton = document.getElementById('button-addon2');

    // Function to filter the coins by name
    const filterCoinsByName = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredCoins = data.data.coins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm)
      );
      displayCoins(filteredCoins);
    };

    // Display the coins in the table
    const displayCoins = (coins) => {
      tbody.innerHTML = '';

      // Iterate through the filtered coins and generate table rows
      coins.forEach((coin, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td>${coin.name}</td>
          <td><img src="${coin.iconUrl}" alt="${coin.name}" width="30"></td>
          <td>$${coin.price}</td>
          <td>${coin.marketCap}</td>
          <td>${coin["24hVolume"]}</td>
          <td>${coin.circulatingSupply}</td>
          <td>${coin.btcPrice}</td>
          <td><canvas id="sparkline-${index}"></canvas></td>
        `;

        tbody.appendChild(row);

        const chartData = coin.sparkline.map(value => parseFloat(value));
        const chartElement = document.getElementById(`sparkline-${index}`);
        new Chart(chartElement, {
          type: 'line',
          data: {
            labels: coin.sparkline,
            datasets: [{
              data: chartData,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: 'blue',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: false
              }],
              yAxes: [{
                display: false
              }]
            }
          }
        });
      });
    };

    // Event listener for the search button
    searchButton.addEventListener('click', filterCoinsByName);

    // Initial display of all coins
    displayCoins(data.data.coins);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
