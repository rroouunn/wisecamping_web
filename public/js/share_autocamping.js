// 쿼리를 통해 추출된 데이터가 사용자에게 보여지는 것 

$(document).ready(function () {
    $('#product_list').empty();
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let tempHtml = add_product(product);
        $('#product_list').append(tempHtml);
    }
})

function add_product(product) {
    return `<div class="col-lg-4 col-sm-6">
    <div class="single_ihotel_list">
        <a href="Share_car_detail1.html"><img src="img/camptown6.png" alt=""></a>
        <div class="hover_text">
            <div class="hotel_social_icon">
                            <ul>
                                <li><a href="#"><i class="ti-facebook"></i></a></li>
                                <li><a href="#"><i class="ti-twitter-alt"></i></a></li>
                                <li><a href="#"><i class="ti-linkedin"></i></a></li>
                            </ul>
            </div>
            <div class="share_icon">
                <i class="ti-share"></i>
            </div>
        </div>
        <div class="hotel_text_iner">
            <h3> <a href="#"> <%= product.goodsname %></a></h3>
                <div class="place_review">
                    <a href="#"><i class="fas fa-star"></i></a>
                    <a href="#"><i class="fas fa-star"></i></a>
                    <a href="#"><i class="fas fa-star"></i></a>
                    <a href="#"><i class="fas fa-star"></i></a>
                    <a href="#"><i class="fas fa-star"></i></a>
                    <span>(47 review)</span>
                </div>
                <p></p>
                <h5>From <span><%= product.shareprice %>원</span></h5>
            </div>
        </div>
    </div>`
}