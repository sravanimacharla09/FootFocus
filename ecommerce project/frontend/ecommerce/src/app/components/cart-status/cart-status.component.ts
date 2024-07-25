import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent {
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private cartService: CartService) { }
  updateCartStatus() {
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    //subscribeto the cart totalQuantity
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
  }

  ngOnInit() {
    this.updateCartStatus();
  }
}
