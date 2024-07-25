import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = []

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  //data will be closed even browser window is closed
  //storage: Storage = sessionStorage

  //data will be available  even browsre window is closed
  storage: Storage = localStorage
  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems'));
    if (data != null) {
      this.cartItems = data;
    }

    //compute totals based on the data that is read from storage
    this.computeCartTotals();
  }

  //adding CartItems to the storage
  persistCarItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      //finding the item in the cart based on item id
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id

      );

      //check if we found it
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      //incerement the quantity 
      alert("Product Updated to cart")
      existingCartItem.quantity++;
    } else {
      //just add the item to the cartItems array
      alert("new product added to cart")
      this.cartItems.push(theCartItem);
    }

    //compute cart total and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //persist cart data
    this.persistCarItems();
  }
  remove(theCartItem: CartItem) {
    //get index of item from cartItems array
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );

    //if found,remove item
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);


      //update cart total and cart price
      this.computeCartTotals();
    }

  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      //remove item from cart
      this.remove(theCartItem);

    } else {
      this.computeCartTotals();
    }
  }

  incrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity++;
    this.computeCartTotals();
  }
}

