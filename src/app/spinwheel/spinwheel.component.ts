import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { OfferTypes } from '../../models/OfferTypes'
import * as d3 from "d3";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-spinwheel',
  templateUrl: './spinwheel.component.html',
  styleUrls: ['./spinwheel.component.scss']
})
export class SpinwheelComponent implements OnInit {

  DEAL_DISCOUNT = 'discount'
  DEAL_GIFT_BOX = 'giftbox'
  DEAL_JACKPOT  = 'jackpot'
  DEAL_NO_DEAL  = 'nodeal'
  DEAL_VOUCHER  = 'voucher'
  DEAL_OFFER    = 'offer'

  selectedOffer: OfferTypes;
  data: OfferTypes[] = [
    {'label':'No Deal',  'prob': 1, 'dealType': this.DEAL_NO_DEAL}, 
    {'label': "10% Off",  'prob': 1, 'dealType': this.DEAL_DISCOUNT}, 
    {'label': "15% Off",  'prob': 1, 'dealType': this.DEAL_DISCOUNT}, 
    {'label':'Gift Box',  'prob': 1, 'dealType': this.DEAL_GIFT_BOX},
    {'label': "Diwali Vourcher",  'prob': 1, 'dealType': this.DEAL_VOUCHER}, 
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

    @ViewChild('content',{read:"",static:false}) content: ElementRef;
    constructor(private modalService: NgbModal) { 

  }

  ngOnInit() {
    this.drawWheel();
  }

  drawWheel(){
    var padding = {top: 20, right: 16, bottom: 0, left: 16};

    var w = 360 - padding.left - padding.right;
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
 
              var  ps       = 360/self.data.length,
                   pieslice = 50000,
                   rng      = Math.floor((Math.random() * pieslice) + 360);
                  
              rotation = (Math.round(rng / ps) * ps);
              
              picked = Math.round(self.data.length - (rotation % 360)/ps);
              picked = picked >= self.data.length ? (picked % self.data.length) : picked;

              console.log("picked "+picked)

              // if (picked != 7) {
              //   d3.select(this).call(spin);
              // }

              rotation += 90 - Math.round(ps/2);
              vis.transition()
                  .duration(4000)
                  .attrTween("transform", rotTween)
                  .on("end", function(){
                      //populate question
                      self.selectedOffer = self.data[picked];
                      oldrotation = rotation;
                    
                      container.on("click", spin);

                      self.showModalOnSelectedOffer()
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
            var i = d3.interpolate(oldrotation % 360, rotation);
            return function(t) {
              return "rotate(" + i(t) + ")";
            };
          }

  }


  showModalOnSelectedOffer() {

    //set content to display on modal
    if (this.selectedOffer != null) {
      switch (this.selectedOffer.dealType) {
        case this.DEAL_NO_DEAL:
          this.spinTitle = 'Better deal yet to get'
          this.spinSubtitle = 'No deal, No worry! spin & win will be back tomorrow for you.'
          this.spinOfferLabel = 'SPAR Super Deals'
          break;
        case this.DEAL_DISCOUNT:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You got a deal to get discount on your purchase'
            this.spinOfferLabel = this.selectedOffer.label
          break;
        case this.DEAL_GIFT_BOX:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You have entered to lucky draw to get SPAR Gift Box'
            this.spinOfferLabel = this.selectedOffer.label
          break;
        case this.DEAL_JACKPOT:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You have entered to lucky draw to avail SPAR JACKPOT deals'
            this.spinOfferLabel = this.selectedOffer.label
          break;
        case this.DEAL_OFFER:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You won the offer! collect with your purchase'
            this.spinOfferLabel = this.selectedOffer.label
          break;
        case this.DEAL_VOUCHER:
            this.spinTitle = 'Well done!'
            this.spinSubtitle = 'You have entered to lucky draw to get a SPAR VOUCHER'
            this.spinOfferLabel = this.selectedOffer.label
          break;
      
        default:
          break;
      }
    }

    this.open(this.content);
  }

  open(content) {
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



//MARK: SHARE ACTIONS
didTapShare() {
  
}

}
