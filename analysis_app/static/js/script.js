// Global Chart instances to allow for destruction/re-creation
let monthlyChartInstance;
let yearlyChartInstance;
const boardSpecificChartInstances = {}; // Store instances by their combined board key

// Global variables to store the raw data for easier re-rendering
let currentTemporalData = null;
let currentQueryTerm = ''; // Store the query term for percentage calculation


document.addEventListener('DOMContentLoaded', function() {
    loadBoards();

    // Set default search query
    document.getElementById('queryInput').value = 'free helicopter ride';

    // Set default date range (ISO format is required for input[type="date"])
    document.getElementById('startDate').value = '2013-01-01';
    document.getElementById('endDate').value = '2023-01-01';
});


async function loadBoards() {
    try {
        const response = await fetch('/api/boards');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const boards = await response.json(); // These are now "board (platform)" strings
        const boardSelect = document.getElementById('boardSelect');
        boardSelect.innerHTML = ''; // Clear existing options

        boards.forEach(boardPlatformString => {
            const option = document.createElement('option');
            option.value = boardPlatformString;
            option.textContent = boardPlatformString;
            boardSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading boards:', error);
        alert('Failed to load board options. Check console for details.');
    }
}

function selectAllBoards() {
    const boardSelect = document.getElementById('boardSelect');
    for (let i = 0; i < boardSelect.options.length; i++) {
        boardSelect.options[i].selected = true;
    }
}

function clearSelectedBoards() {
    const boardSelect = document.getElementById('boardSelect');
    for (let i = 0; i < boardSelect.options.length; i++) {
        boardSelect.options[i].selected = false;
    }
}

async function searchData() {
    const queryTerm = document.getElementById('queryInput').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const boardSelect = document.getElementById('boardSelect');
    const selectedBoards = Array.from(boardSelect.options)
                               .filter(option => option.selected)
                               .map(option => option.value);

    if (!queryTerm) {
        alert('Please enter a query term.');
        return;
    }

    document.getElementById('resultsHeader').textContent = `Analyzing: "${queryTerm}"`;
    document.getElementById('results').style.display = 'block'; // Show results section

    const payload = {
        query_term: queryTerm,
        start_date: startDate || null,
        end_date: endDate || null,
        boards: selectedBoards // This sends the combined strings
    };

    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Store the current data globally
        currentTemporalData = data.temporal_data;
        currentQueryTerm = data.query_term; // Store query term for percentage labels

        updateSummary(data);
        updateCoOccurrences(data);

        updateTemporalDistribution(currentTemporalData, currentQueryTerm, document.getElementById('showTotalPostsToggle').checked, document.getElementById('showPercentageToggle').checked);

        updateImageAnalysis(data);
        updatePostSnippets(data);

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data. Check console for details.');
        document.getElementById('resultsHeader').textContent = `Error analyzing: "${queryTerm}"`;
        document.getElementById('results').style.display = 'none'; // Hide results on error
    }
}

function updateSummary(data) {
    document.getElementById('totalMentions').textContent = data.total_mentions;
    document.getElementById('postsWithImages').textContent = data.image_analysis.posts_with_images;
    document.getElementById('percentageWithImages').textContent = data.image_analysis.percentage_with_images.toFixed(2);
}

function updateCoOccurrences(data) {
    const list = document.getElementById('coOccurrencesList');
    list.innerHTML = '';
    if (data.co_occurrences && data.co_occurrences.length > 0) {
        data.co_occurrences.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item[0]} (${item[1]})`;
            list.appendChild(li);
        });
    renderWordCloud(data.co_occurrences);
    } else {
        list.textContent = 'No significant co-occurring words found.';
    }

    // Show co-occurrences over time
    const yearlyContainer = document.getElementById('coOccurrencesOverTime');
    yearlyContainer.innerHTML = '<h4>How co-occurrences changed over time</h4>';
    if (data.co_occurrences_over_time) {
        for (const [year, phrases] of Object.entries(data.co_occurrences_over_time)) {
            const yearBlock = document.createElement('div');
            yearBlock.innerHTML = `<h5>${year}</h5>`;
            const ul = document.createElement('ul');
            phrases.forEach(([phrase, count]) => {
                const li = document.createElement('li');
                li.textContent = `${phrase} (${count})`;
                ul.appendChild(li);
            });
            yearBlock.appendChild(ul);
            yearlyContainer.appendChild(yearBlock);
        }
    }

    function renderWordCloud(coOccurrences) {
        const wordEntries = coOccurrences.map(([word, freq]) => [word, freq]);

        const canvas = document.getElementById("wordCloudCanvas");
        if (!canvas) return;

        WordCloud(canvas, {
            list: wordEntries,
            gridSize: 12,
            weightFactor: 3,
            fontFamily: 'Arial, sans-serif',
            color: () => '#' + Math.floor(Math.random()*16777215).toString(16),
            backgroundColor: '#ffffff',
            rotateRatio: 0.5,
            rotationSteps: 2
        });
        }
}

function updateTemporalDistribution(temporalData, queryTerm, showTotalPosts, showPercentage) {
    // Destroy existing chart instances before creating new ones
    if (monthlyChartInstance) monthlyChartInstance.destroy();
    if (yearlyChartInstance) yearlyChartInstance.destroy();
    for (const key in boardSpecificChartInstances) {
        if (boardSpecificChartInstances[key]) boardSpecificChartInstances[key].destroy();
    }
    Object.keys(boardSpecificChartInstances).forEach(key => delete boardSpecificChartInstances[key]);

    // --- Overall Monthly Chart ---
    const overallMonthlyLabels = temporalData.overall_monthly.map(item => item[0]);
    const overallMonthlyQueryData = temporalData.overall_monthly.map(item => item[1]);
    
    // Prepare datasets based on toggles
    let monthlyDatasets = [{
        label: `"${queryTerm}" Mentions`,
        data: overallMonthlyQueryData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
        type: 'line',
        yAxisID: 'y'
    }];

    if (showTotalPosts) {
        const totalMonthlyDataMap = new Map(temporalData.total_overall_monthly);
        const totalMonthlyCounts = overallMonthlyLabels.map(label => totalMonthlyDataMap.get(label) || 0);
        monthlyDatasets.push({
            label: 'Total Posts',
            data: totalMonthlyCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
            type: 'line',
            yAxisID: 'y_total_posts' // Use a separate Y-axis for total posts
        });
    }

    if (showPercentage) {
        const totalMonthlyDataMap = new Map(temporalData.total_overall_monthly);
        const monthlyPercentages = overallMonthlyLabels.map(label => {
            const queryCount = new Map(temporalData.overall_monthly).get(label) || 0;
            const totalCount = totalMonthlyDataMap.get(label) || 0;
            return totalCount > 0 ? (queryCount / totalCount) * 100 : 0;
        });
        monthlyDatasets.push({
            label: `"${queryTerm}" % of Total Posts`,
            data: monthlyPercentages,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            fill: false,
            type: 'line',
            yAxisID: 'y_percentage' // Use a separate Y-axis for percentage
        });
    }

    monthlyChartInstance = createChart('monthlyChart', overallMonthlyLabels, monthlyDatasets, 'Overall Monthly Mentions');

    // --- Overall Yearly Chart ---
    const overallYearlyLabels = temporalData.overall_yearly.map(item => item[0]);
    const overallYearlyQueryData = temporalData.overall_yearly.map(item => item[1]);

    let yearlyDatasets = [{
        label: `"${queryTerm}" Mentions`,
        data: overallYearlyQueryData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        type: 'bar',
        yAxisID: 'y'
    }];

    if (showTotalPosts) {
        const totalYearlyDataMap = new Map(temporalData.total_overall_yearly);
        const totalYearlyCounts = overallYearlyLabels.map(label => totalYearlyDataMap.get(label) || 0);
        yearlyDatasets.push({
            label: 'Total Posts',
            data: totalYearlyCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y_total_posts'
        });
    }

    if (showPercentage) {
        const totalYearlyDataMap = new Map(temporalData.total_overall_yearly);
        const yearlyPercentages = overallYearlyLabels.map(label => {
            const queryCount = new Map(temporalData.overall_yearly).get(label) || 0;
            const totalCount = totalYearlyDataMap.get(label) || 0;
            return totalCount > 0 ? (queryCount / totalCount) * 100 : 0;
        });
        yearlyDatasets.push({
            label: `"${queryTerm}" % of Total Posts`,
            data: yearlyPercentages,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y_percentage'
        });
    }

    yearlyChartInstance = createChart('yearlyChart', overallYearlyLabels, yearlyDatasets, 'Overall Yearly Mentions');

    // --- Board Specific Charts (now includes platform) ---
    const boardSpecificChartsDiv = document.getElementById('boardSpecificCharts');
    boardSpecificChartsDiv.innerHTML = '<h4>Board Specific Temporal Mentions</h4>';

    const boardMonthlyData = temporalData.board_platform_monthly;
    const totalBoardMonthlyData = temporalData.total_board_platform_monthly;
    const boardYearlyData = temporalData.board_platform_yearly;
    const totalBoardYearlyData = temporalData.total_board_platform_yearly;

    for (const boardPlatformKey in boardMonthlyData) {
        // Monthly chart for this specific board (platform)
        const monthlyContainer = document.createElement('div');
        monthlyContainer.className = 'chart-container';
        const monthlyTitle = document.createElement('h5');
        monthlyTitle.textContent = `Monthly Mentions: ${boardPlatformKey}`;
        const monthlyCanvas = document.createElement('canvas');
        const canvasIdMonthly = `monthlyChart-${boardPlatformKey.replace(/[^a-zA-Z0-9]/g, '-')}`;
        monthlyCanvas.id = canvasIdMonthly;
        monthlyContainer.appendChild(monthlyTitle);
        monthlyContainer.appendChild(monthlyCanvas);
        boardSpecificChartsDiv.appendChild(monthlyContainer);

        const labels = boardMonthlyData[boardPlatformKey].map(item => item[0]);
        const queryCounts = boardMonthlyData[boardPlatformKey].map(item => item[1]);
        
        let boardMonthlyDatasets = [{
            label: `"${queryTerm}" Mentions`,
            data: queryCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true,
            type: 'line',
            yAxisID: 'y'
        }];

        if (showTotalPosts) {
            const totalBoardDataMap = new Map(totalBoardMonthlyData[boardPlatformKey] || []);
            const totalCounts = labels.map(label => totalBoardDataMap.get(label) || 0);
            boardMonthlyDatasets.push({
                label: 'Total Posts',
                data: totalCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
                type: 'line',
                yAxisID: 'y_total_posts'
            });
        }
        
        if (showPercentage) {
            const totalBoardDataMap = new Map(totalBoardMonthlyData[boardPlatformKey] || []);
            const percentages = labels.map(label => {
                const qCount = new Map(boardMonthlyData[boardPlatformKey]).get(label) || 0;
                const tCount = totalBoardDataMap.get(label) || 0;
                return tCount > 0 ? (qCount / tCount) * 100 : 0;
            });
            boardMonthlyDatasets.push({
                label: `"${queryTerm}" % of Total Posts`,
                data: percentages,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: false,
                type: 'line',
                yAxisID: 'y_percentage'
            });
        }

        boardSpecificChartInstances[canvasIdMonthly] = createChart(canvasIdMonthly, labels, boardMonthlyDatasets, `Monthly Mentions: ${boardPlatformKey}`);
    }

    for (const boardPlatformKey in boardYearlyData) {
        const yearlyContainer = document.createElement('div');
        yearlyContainer.className = 'chart-container';
        const yearlyTitle = document.createElement('h5');
        yearlyTitle.textContent = `Yearly Mentions: ${boardPlatformKey}`;
        const yearlyCanvas = document.createElement('canvas');
        const canvasIdYearly = `yearlyChart-${boardPlatformKey.replace(/[^a-zA-Z0-9]/g, '-')}`;
        yearlyCanvas.id = canvasIdYearly;
        yearlyContainer.appendChild(yearlyTitle);
        yearlyContainer.appendChild(yearlyCanvas);
        boardSpecificChartsDiv.appendChild(yearlyContainer);

        const labels = boardYearlyData[boardPlatformKey].map(item => item[0]);
        const queryCounts = boardYearlyData[boardPlatformKey].map(item => item[1]);
        
        let boardYearlyDatasets = [{
            label: `"${queryTerm}" Mentions`,
            data: queryCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y'
        }];

        if (showTotalPosts) {
            const totalBoardDataMap = new Map(totalBoardYearlyData[boardPlatformKey] || []);
            const totalCounts = labels.map(label => totalBoardDataMap.get(label) || 0);
            boardYearlyDatasets.push({
                label: 'Total Posts',
                data: totalCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y_total_posts'
            });
        }

        if (showPercentage) {
            const totalBoardDataMap = new Map(totalBoardYearlyData[boardPlatformKey] || []);
            const percentages = labels.map(label => {
                const qCount = new Map(boardYearlyData[boardPlatformKey]).get(label) || 0;
                const tCount = totalBoardDataMap.get(label) || 0;
                return tCount > 0 ? (qCount / tCount) * 100 : 0;
            });
            boardYearlyDatasets.push({
                label: `"${queryTerm}" % of Total Posts`,
                data: percentages,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y_percentage'
            });
        }

        boardSpecificChartInstances[canvasIdYearly] = createChart(canvasIdYearly, labels, boardYearlyDatasets, `Yearly Mentions: ${boardPlatformKey}`);
    }
}


// Reusable Chart creation function, can accept an array of datasets
function createChart(canvasId, labels, datasets, titleText) { // datasets as an array
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Define y-axes dynamically based on what's included in datasets
    const yAxes = {
        y: { // Default Y-axis for query mentions
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: {
                display: true,
                text: 'Mentions'
            }
        }
    };

    if (datasets.some(d => d.yAxisID === 'y_total_posts')) {
        yAxes.y_total_posts = {
            type: 'linear',
            position: 'right', // Place on right side
            beginAtZero: true,
            grid: {
                drawOnChartArea: false // Only draw the grid for the main Y-axis
            },
            title: {
                display: true,
                text: 'Total Posts'
            }
        };
    }

    if (datasets.some(d => d.yAxisID === 'y_percentage')) {
        yAxes.y_percentage = {
            type: 'linear',
            position: datasets.some(d => d.yAxisID === 'y_total_posts') ? 'right' : 'left', // If total posts is present, put on right, otherwise left
            beginAtZero: true,
            max: 100, // Percentage goes up to 100%
            grid: {
                drawOnChartArea: false // Only draw the grid for the main Y-axis
            },
            title: {
                display: true,
                text: 'Percentage (%)'
            },
            // Add a tick callback to format as percentage
            ticks: {
                callback: function(value) {
                    return value + '%';
                }
            }
        };
        // Adjust position if both total_posts and percentage are present to avoid overlap
        if (datasets.some(d => d.yAxisID === 'y_total_posts') && datasets.some(d => d.yAxisID === 'y_percentage')) {
            yAxes.y_percentage.position = 'right'; // Prioritize query mentions and total posts on left/right, percentage can go on the other side or further right
            yAxes.y_percentage.offset = true; // Add offset to prevent labels overlapping if both are on the right
        }
    }


    const chartType = datasets[0] ? datasets[0].type : 'line';

    return new Chart(ctx, {
        type: chartType, // Base type, individual datasets can override
        data: {
            labels: labels,
            datasets: datasets // Pass the array of datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: yAxes, // Use the dynamically generated y-axes
            plugins: {
                title: {
                    display: true,
                    text: titleText
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.dataset.yAxisID === 'y_percentage') {
                                label += context.formattedValue + '%';
                            } else {
                                label += context.formattedValue;
                            }
                            return label;
                        }
                    }
                }
                // zoom: {
                //     zoom: {
                //         wheel: { enabled: false },
                //         pinch: { enabled: false },
                //         mode: 'x',
                //     },
                //     pan: {
                //         enabled: false,
                //         mode: 'x',
                //     }
                // }
            }
        }
    });
}

// Toggle functions to re-render charts based on checkbox state
function toggleTotalPosts() {
    if (currentTemporalData) {
        updateTemporalDistribution(currentTemporalData, currentQueryTerm, 
                                   document.getElementById('showTotalPostsToggle').checked,
                                   document.getElementById('showPercentageToggle').checked);
    }
}

function togglePercentage() {
    if (currentTemporalData) {
        updateTemporalDistribution(currentTemporalData, currentQueryTerm, 
                                   document.getElementById('showTotalPostsToggle').checked,
                                   document.getElementById('showPercentageToggle').checked);
    }
}


function updateImageAnalysis(data) {
    const gallery = document.getElementById('imageGallery');
    gallery.innerHTML = ''; // Clear previous images

    if (data.image_analysis.image_urls && data.image_analysis.image_urls.length > 0) {
        data.image_analysis.image_urls.forEach(url => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'image-item';
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Attached Image';
            img.loading = 'lazy'; // Lazy load images
            imgWrapper.appendChild(img);
            gallery.appendChild(imgWrapper);
        });
    } else if (data.image_analysis.image_file_names && data.image_analysis.image_file_names.length > 0) {
        // Fallback to displaying filenames if URLs are not present, or create links
        const ul = document.createElement('ul');
        data.image_analysis.image_file_names.forEach(filename => {
            const li = document.createElement('li');
            li.textContent = filename;
            ul.appendChild(li);
        });
        gallery.appendChild(ul);
    } else {
        gallery.textContent = 'No images found for these posts.';
    }
}


function updatePostSnippets(data) {
    const snippetsDiv = document.getElementById('postSnippets');
    snippetsDiv.innerHTML = '';
    if (data.post_snippets && data.post_snippets.length > 0) {
        data.post_snippets.forEach(snippet => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-snippet';
            postDiv.innerHTML = `
                <p><strong>Board:</strong> ${snippet.board} (${snippet.platform})</p>
                <p><strong>Timestamp:</strong> ${snippet.timestamp}</p>
                <p><strong>Subject:</strong> ${snippet.subject || 'N/A'}</p>
                <p><strong>Body:</strong> ${snippet.body_snippet || 'N/A'}</p>
                ${snippet.image_url ? `<p><img src="${snippet.image_url}" alt="Image" style="max-width: 100px; max-height: 100px; display: block;"></p>` : ''}
                ${snippet.image_file && !snippet.image_url ? `<p>Attached File: ${snippet.image_file}</p>` : ''}
            `;
            snippetsDiv.appendChild(postDiv);
        });
    } else {
        snippetsDiv.textContent = 'No post snippets found.';
    }
}

function applyCustomCss() {
    const cssEditor = document.getElementById('customCssEditor');
    const customCss = cssEditor.value;
    let styleTag = document.getElementById('customStyle');

    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'customStyle';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = customCss;
    alert('Custom CSS applied!');
}