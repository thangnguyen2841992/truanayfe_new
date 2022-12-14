import {Component, OnInit} from '@angular/core';
import {Merchant} from '../../model/merchant';
import {AuthService} from '../../service/auth/auth.service';
import {CartService} from '../../service/cart/cart.service';
import {Cart} from '../../model/cart';
import {DeliveryInfo} from '../../model/delivery-info';
import {DeliveryInfoService} from '../../service/delivery-info/delivery-info.service';
import {OrderService} from '../../service/order/order.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {NotificationService} from '../../service/notification/notification.service';
import {User} from '../../model/user';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {Coupon} from "../../model/coupon";

declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  merchantId: number;
  currentUser: any;
  loggedIn: boolean;
  userId: number;
  deliveryInfoId: number;
  cart: Cart;
  total: number;
  defaultDeliveryInfo: DeliveryInfo;
  otherDeliveryInfo: DeliveryInfo[] = [];
  editDeliveryInfo: DeliveryInfo = {};
  createDeliveryInfo: DeliveryInfo = {};
  deliveryInfoForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl('', [Validators.pattern
    ('^[0](\\+\\d{1,3}\\s?)?((\\(\\d{3}\\)\\s?)|(\\d{3})(\\s|-?))(\\d{3}(\\s|-?))(\\d{3})(\\s?(([E|e]xt[:|.|]?)|x|X)(\\s?\\d+))?')]),
  });

  noteShipperForm: FormGroup = new FormGroup({
    noteShipper: new FormControl('')
  });
  currentUserId: number;
  noteRestaurant: string;
  couponId: number;
  constructor(private authService: AuthService,
              private cartService: CartService,
              private deliveryInfoService: DeliveryInfoService,
              private orderService: OrderService,
              private router: Router,
              private notificationService: NotificationService,
              private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.merchantId = +paramMap.get('merchant-id');
    });
    this.currentUserId = this.authService.currentUserValue.id;
  }

  ngOnInit() {
    document.getElementById('checkout-info-div').scrollIntoView(true);

    this.checkLoginAndGetInfo();

    this.getDeliveryInfo();
  }

  checkLoginAndGetInfo() {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.currentUser = this.authService.getCurrentUser();
      this.getCart();
    }
  }


  getCart() {
    this.cartService.getCurrentUserCartByMerchant(this.merchantId).subscribe(
      (response) => {
        this.cart = (response as Cart);
      }
    );
  }

  getDeliveryInfo() {
    this.deliveryInfoService.getDefaultDeliveryInfo(this.authService.getCurrentUserId()).subscribe(
      (response) => this.defaultDeliveryInfo = response
    );

    this.deliveryInfoService.getOtherDeliveryInfos(this.authService.getCurrentUserId()).subscribe(
      (response) => this.otherDeliveryInfo = response
    );
  }

  changeCartFromChildComponent($event) {
    this.cart = $event;
  }
  getNoteRestaurant($event) {
    this.noteRestaurant = $event;
    console.log(this.noteRestaurant);
  }
  putToModalEditDeliveryInfo(deliveryInfo: DeliveryInfo) {
    this.deliveryInfoId = deliveryInfo.id;
    this.deliveryInfoForm.get('name').setValue(deliveryInfo.name);
    this.deliveryInfoForm.get('phone').setValue(deliveryInfo.phone);
    this.deliveryInfoForm.get('address').setValue(deliveryInfo.address);
  }


  submitFormEditDeliveryInfo() {
    this.editDeliveryInfo = this.deliveryInfoForm.value;
    this.editDeliveryInfo.id = this.deliveryInfoId;
    console.log(this.editDeliveryInfo);
    this.deliveryInfoService.updateDeliveryInfo(this.deliveryInfoId, this.editDeliveryInfo).subscribe(() => {
      this.notificationService.showMessage('success', 'C???p nh???t th??nh c??ng');
      this.getDeliveryInfo();
    }, error => {
      this.notificationService.showMessage('error', error.error.message);
    }, () => {
      $('edit-delivery-modal').modal('hide');
    });

  }

  submitFormCreateDeliveryInfo() {
    this.createDeliveryInfo = this.deliveryInfoForm.value;
    this.createDeliveryInfo.user = {id: this.authService.getCurrentUserId()};
    console.log(this.createDeliveryInfo);
    this.deliveryInfoService.createDelivery(this.createDeliveryInfo).subscribe(() => {
      this.notificationService.showMessage('success', 'Th??m th??nh c??ng');
      this.getDeliveryInfo();
    }, error => {
      this.notificationService.showMessage('error', error.error.message);
    }, () => {
      $('create-delivery-modal').modal('hide');
    });

  }

  chooseDeliveryInfo(userId: number, deliveryInfoId: number) {
    this.deliveryInfoService.setDeliveryInfoToSelected(userId, deliveryInfoId).subscribe(() => {
      this.getDeliveryInfo();
    });
    console.log(`make delivery info default:  idDelivery=${deliveryInfoId} userId=${userId}`);
  }


  submitOrder() {
    const orderDto = {
      cart: this.cart,
      deliveryInfo: this.defaultDeliveryInfo,
      couponId: this.couponId,
      noteShipper: this.noteShipperForm.value.noteShipper,
      noteRestaurant: this.noteRestaurant
    };
    this.orderService.createOrder(this.currentUserId, orderDto).subscribe(
      (order) => {
        this.router.navigateByUrl(`/order-success/${order.id}`);
      },
      error => {
        this.notificationService.showErrorMessage(`Kh??ng th??? t???o ????n h??ng: <br> ${error.error.message}`);
      }
    );
  }

  clearForm() {
    this.deliveryInfoForm.get('name').setValue('');
    this.deliveryInfoForm.get('address').setValue('');
    this.deliveryInfoForm.get('phone').setValue('');
  }

  getCoupon($event) {
    this.couponId = $event;
    console.log(this.couponId);
  }
}
