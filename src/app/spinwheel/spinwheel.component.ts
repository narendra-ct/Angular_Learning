import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { OfferTypes } from '../../models/OfferTypes'
import * as d3 from "d3";
import * as html2canvas from 'html2canvas';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-spinwheel',
  templateUrl: './spinwheel.component.html',
  styleUrls: ['./spinwheel.component.scss']
})
export class SpinwheelComponent implements OnInit {


  // sharing feature links
  portalURL = "https://bit.ly/2n0xrrN";
  // whatsappShare =  "whatsapp://send?text=720kb%20is%20enough%20http%3A%2F%2F720kb.net"
  whatsappShare = "Shop with SPAR and get exciting diwali deals and vouchers. Play a Game and win exiciting deals, coupons and diwali Gift Box. https://bit.ly/2n0xrrN";
  mailShare = "mailto:?Subject=Shop With SPAR&body= Shop with SPAR and get exciting diwali deals and vouchers. Play a Game and win exiciting deals, coupons and diwali Gift Box. https://bit.ly/2n0xrrN";
  smsShare = "Shop with SPAR and get exciting diwali deals and vouchers. Play a Game and win exiciting deals, coupons and diwali Gift Box. https://bit.ly/2n0xrrN";
  twitterShare = "Shop with SPAR and get exciting diwali deals and vouchers. Play a Game and win exiciting deals, coupons and diwali Gift Box.";
  hashtags  = "ShopWithSpar,SparSpinAndWin";

  DEAL_DISCOUNT = 'discount';
  DEAL_GIFT_BOX = 'giftbox';
  DEAL_JACKPOT  = 'jackpot';
  DEAL_NO_DEAL  = 'nodeal';
  DEAL_VOUCHER  = 'voucher';
  DEAL_OFFER    = 'offer';

  selectedOffer: OfferTypes;
  data: OfferTypes[] = [
    {'label':'No Deal',  'prob': 1, 'dealType': this.DEAL_NO_DEAL}, 
    {'label': "10% Off",  'prob': 1, 'dealType': this.DEAL_DISCOUNT}, 
    {'label': "15% Off",  'prob': 1, 'dealType': this.DEAL_DISCOUNT}, 
    {'label':'Gift Box',  'prob': 1, 'dealType': this.DEAL_GIFT_BOX},
    {'label': "Diwali Voucher",  'prob': 1, 'dealType': this.DEAL_VOUCHER}, 
    {'label': "JACKPOT",  'prob': 1, 'dealType': this.DEAL_JACKPOT},
    {'label': "Better Luck",  'prob': 1, 'dealType': this.DEAL_NO_DEAL},
    {'label': "Upto 30% Off",  'prob': 1, 'dealType': this.DEAL_DISCOUNT},
    {'label': "Rs.100/- Off",  'prob': 1, 'dealType': this.DEAL_DISCOUNT},
    {'label': "Buy 1 Get 1",  'prob': 1, 'dealType': this.DEAL_OFFER}];

    closeResult: string;

    spinTitle:string;
    spinSubtitle:string;
    spinOfferLabel:string;
    spinCollectOfferLabel:string = 'Walk to SPAR with coupon or screenshot to reedem offer at SPAR Store, VR Mall'

    enableDownloadImage = false
    showDownload = false
    showAnimation = true

  @ViewChild('content',{read:"",static:false}) content: ElementRef;

  @ViewChild('capture',{read:"",static:false}) screen: ElementRef;
  @ViewChild('canvas',{read:"",static:false}) canvas: ElementRef;
  @ViewChild('downloadLink',{read:"",static:false}) downloadLink: ElementRef;


    constructor(private modalService: NgbModal) { 
    }

    //On Init
  ngOnInit() {
    this.drawWheel();

    // this.loadConfettiAnimation()
  }

  didTapSMS() {
    var ua = navigator.userAgent.toLowerCase();
    var msg = encodeURIComponent(this.smsShare)
		if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) {
			window.location.href = "sms:&body=" + msg
		} else {
      window.location.href = "sms:?body=" + msg
    }
    
  }

  didTapWhatsapp() {
    var msg = encodeURIComponent(this.whatsappShare)
    window.location.href = "whatsapp://send?text=" + msg;

  }

  didTapFacebook(){
    let url = "https://www.facebook.com/sharer/sharer.php?u=" + this.portalURL
    window.open(url, "pop");
  }

  downloadImage(){

    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'spar-voucher.png';
      this.downloadLink.nativeElement.click();

      // hide 
      this.enableDownloadImage = false
    });
  }

  //DRAW WHEEL/SPIN
  drawWheel(){
    var padding = {top: 0, right: 16, bottom: 0, left: 16};

    var w = 320 - padding.left - padding.right;
    var h = 550 - padding.top  - padding.bottom;
    var r = Math.min(w, h) / 2;
    var picked: number = 999999;
    var rotation:number = 0;
    var oldrotation:number = 0;
    var color = d3.scaleOrdinal(d3.schemeCategory10) 
    // var color = d3.scale.category20();

    var svg = d3.select('#chart')
            .append("svg")
            .data([this.data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);

        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

        var vis = container.append("g");
            
        var pie = d3.pie().value(function(d){return d.prob;}).sort(null);

        // declare an arc generator function
        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");
            
        arcs.append("path")
            .attr("fill", function(d, i){ return color(i); })
            .attr("d", function (d) { return arc(d); });

        // add the text
        var self = this;
        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
            })
            .attr("text-anchor", "end")
            .attr("fill", "white")
            .text( function(d, i) {
                return self.data[i].label;
            });
        
        container.on("click", spin);

        function spin(d){
            
              container.on("click", null);
              self.selectedOffer = null
 
              debugger
              var  ps       = 360/self.data.length,
                   pieslice = 2345,
                   rng      = Math.floor(Math.random() * pieslice + 360);
                   rng      = rng < 1000 ? rng * 2 : rng

                   console.log(rng)
              rotation = (Math.round(rng / ps) * ps);
              
              picked = Math.round(self.data.length - (rotation % 360)/ps);
              picked = picked >= self.data.length ? (picked % self.data.length) : picked;
              // if (picked != 7) {
              //   d3.select(this).call(spin);
              // }

              rotation += 90 - Math.round(ps/2);
              
              vis.transition()
                  .delay(function(d, i) { return i * 500; })
                  .duration(8000)
                  .attrTween("transform", rotTween)
                  .delay(function(d, i) { return i * 5000; })
                  .on("end", function(){
                      //populate question
                      self.selectedOffer = self.data[picked];
                      oldrotation = rotation;
                    
                      container.on("click", spin);

                      this.loadConfettiAnimation()

                      setTimeout(() => 
                      {
                        this.showAnimation = true
                        self.showModalOnSelectedOffer()
                      },6000);
                  });
          }
          
          //make arrow
          svg.append("g")
              .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
              .append("path")
              .attr("d", "M-" + (r*.25) + ",0L0," + (r*.08) + "L0,-" + (r*.08) + "Z")
              .attr("fill","red");


          //draw spin circle
          container.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 30)
              .attr("fill","white")
              .style({"fill":"white","cursor":"pointer"});

          //spin text
          container.append("text")
              .attr("x", 0)
              .attr("y", 8)
              .attr("text-anchor", "middle")
              .attr("text-align", "center")
              .text("SPIN")
              .attr("fill","green")
              .attr("font-weight","bold")
              .attr("font-size","17px");          
          
          function rotTween(to) {
            console.log(oldrotation % 360)
            console.log(rotation)
            var i = d3.interpolate(oldrotation % 360, rotation);
            console.log(i)
            return function(t) {
              return "rotate(" + i(t) + ")";
            };
          }

  }


  showModalOnSelectedOffer() {

    this.showDownload = false
    //set content to display on modal
    if (this.selectedOffer != null) {
      switch (this.selectedOffer.dealType) {
        case this.DEAL_NO_DEAL:
          this.spinTitle = 'Better deal yet to get'
          this.spinSubtitle = 'No deal, No worry! spin & win will be back tomorrow for you.'
          this.spinOfferLabel = 'SPAR Super Deals'
          this.showDownload = true
          break;
        case this.DEAL_DISCOUNT:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You got a deal to get discount on your purchase'
            this.spinOfferLabel = this.selectedOffer.label + "*"
          break;
        case this.DEAL_GIFT_BOX:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You have entered to lucky draw to get SPAR Gift Box'
            this.spinOfferLabel = this.selectedOffer.label + "*"
          break;
        case this.DEAL_JACKPOT:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You have entered to lucky draw to avail SPAR JACKPOT deals'
            this.spinOfferLabel = this.selectedOffer.label + "*"
          break;
        case this.DEAL_OFFER:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You won the offer! collect with your purchase'
            this.spinOfferLabel = this.selectedOffer.label + "*"
          break;
        case this.DEAL_VOUCHER:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You have entered to lucky draw to get a SPAR VOUCHER'
            this.spinOfferLabel = this.selectedOffer.label + "*"
          break;
      
        default:
          break;
      }
    }

    this.open(this.content);
  }

  open(content) {
    this.enableDownloadImage = true
    this.modalService.open(content, {centered: true,windowClass: 'custom-class'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

loadConfettiAnimation() {
  this.showAnimation = false
  //canvas init
  var canvas: any = document.getElementById("canvasAnimation");
  var ctx = canvas.getContext("2d");

  //canvas dimensions
  var W = window.innerWidth;
  var H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  //snowflake particles
  var mp = 155; //max particles
  var particles = [];
  for (var i = 0; i < mp; i++) {
      particles.push({
          x: Math.random() * W, //x-coordinate
          y: Math.random() * H, //y-coordinate
          r: Math.random() * 20, //radius
          d: Math.random() * mp * 10, //density
          color: "rgba(" + Math.floor(Math.random()*255) +
                  ", " + Math.floor(Math.random()*255) + ", 255, 0.8)"
      })
  }

//Lets draw the flakes
function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < mp; i++) {
        var p = particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();        
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, Math.PI * 2, true);
        ctx.fill();
    }
    
    update();
}

//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var angle = 0;

function update() {
    angle += 0.01;
    for (var i = 0; i < mp; i++) {
        var p = particles[i];
        //Updating X and Y coordinates
        //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
        //Every particle has its own density which can be used to make the downward movement different for each flake
        //Lets make it more random by adding in the radius
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;

        //Sending flakes back from the top when it exits
        //Lets make it a bit more organic and let flakes enter from the left and right also.
        if (p.x > W + 5 || p.x < -5 || p.y > H) {
            if (i % 3 > 0) //66.67% of the flakes
            {
                particles[i] = {
                    x: Math.random() * W,
                    y: -10,
                    r: p.r,
                    d: p.d,
                            color: "rgba(" + Math.floor(Math.random()*255) +
                ", " + Math.floor(Math.random()*255) + ", 255, 0.8)"
                };
            } else {
                //If the flake is exitting from the right
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    particles[i] = {
                        x: -5,
                        y: Math.random() * H,
                        r: p.r,
                        d: p.d,
                                color: "rgba(" + Math.floor(Math.random()*255) +
                ", " + Math.floor(Math.random()*255) + ", 255, 0.8)"
                    };
                } else {
                    //Enter from the right
                    particles[i] = {
                        x: W + 5,
                        y: Math.random() * H,
                        r: p.r,
                        d: p.d,
                                color: "rgba(" + Math.floor(Math.random()*255) +
                ", " + Math.floor(Math.random()*255) + ", 255, 0.8)"
                    };
                }
            }
        }
    }
  }

  //animation loop
  setInterval(draw, 33);
}


}
