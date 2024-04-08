import React from "react";
import defaultimage from "../../assets/images/default_avatar.jpg";
import StarRatings from "react-star-ratings";

const ListReviews = ({ reviews }) => {
  return (
    <div className="container my-5">

    <div class="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      {reviews?.map((review) => (
        <div key={review?._id} class="review-card my-3">
          <div class="row">
            <div class="col-1">
              <img
                src={
                  review?.user?.avatar
                    ? review?.user?.avatar?.url
                    : defaultimage
                  }
                  alt={review?.user?.name}
                width="50"
                height="50"
                class="rounded-circle"
                />
            </div>
            <div class="col-11">
              <StarRatings
              rating={review?.rating}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="22px"
              starSpacing="1px"
              />
              <p class="review_user">by {review?.user?.name}</p>
              <p class="review_comment">{review?.comment}</p>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
      </div>
  );
};

export default ListReviews;
