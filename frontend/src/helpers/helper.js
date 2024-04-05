export const getPriceQueryParams = (searchParams, key, value) =>{

    // checking that searchParams already has a key or not
    const hasValueInParams = searchParams.has(key);

    // check if already has value and key then it means user want to update the value
    if(value && hasValueInParams){
        searchParams.set(key, value)
    }
    else if(value){
        searchParams.append(key, value);
    }
    else if(hasValueInParams){
        searchParams.delete(key);
    }

    return searchParams;
}

export const calculateOrderCost = (cartItems) => {
    const itemPrice = cartItems?.reduce((acc, item) => acc + item.price * item?.quantity, 0);

    // shippign price is null if amount is greater than 500
    const shippingPrice = itemPrice > 500 ? 0 : 100;
    const taxPrice = Number((0.10 * itemPrice).toFixed(2));
    const totalPrice = (itemPrice + shippingPrice + taxPrice).toFixed(2);

    return {        
        itemPrice : Number(itemPrice.toFixed(2)),
        shippingPrice,
        taxPrice,
        totalPrice,
    }
}