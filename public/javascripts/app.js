var toggle_analysis = function () {
    var analysis = document.querySelector('#conversation-analysis');
    var analysis_button = document.querySelector('#analysis_button');
    
    if (analysis.classList.contains('hidden')) {
        analysis.classList.remove('hidden');
        analysis.classList.add('visible');
        analysis_button.textContent = 'Hide Conversation Analysis';
        
    }
    else if (analysis.classList.contains('visible')) {
        analysis.classList.remove('visible');
        analysis.classList.add('hidden');
        analysis_button.textContent = 'Show Conversation Analysis';
    }
}
    
var toggle_products = function () {
    var products = document.querySelector('#products-list');
    var products_button = document.querySelector('#products_button');
    
    if (products.classList.contains('hidden')) {
        products.classList.remove('hidden');
        products.classList.add('visible');
        products_button.textContent = 'Hide Products';
        
    }
    else if (products.classList.contains('visible')) {
        products.classList.remove('visible');
        products.classList.add('hidden');
        products_button.textContent = 'Show Products';
    }
}
    
