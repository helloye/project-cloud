(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(2),c=n.n(r),i=(n(14),n(3)),u=n(4),o=n(6),d=n(5),m=n(7),E=(n(15),function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(d.a)(t).call(this,e))).handleSliderChange=function(e){n.setState({duration:e.target.value})},n.handleSelectConfig=function(e){var t=n.state.config===e?0:e;n.setState({config:t})},n.state={duration:1,config:0},n}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"App"},l.a.createElement("div",{id:"form"},l.a.createElement("div",{id:"request-name"},"Request Name: ",l.a.createElement("input",{placeholder:" Enter your request name here..."})),l.a.createElement("div",{id:"time-slider"},"Duration (hrs):",l.a.createElement("div",{id:"duration-label"},parseFloat(Math.round(100*this.state.duration)/100).toFixed(2)),l.a.createElement("input",{id:"slider",type:"range",min:"1",max:"12",value:this.state.duration,onChange:this.handleSliderChange,step:".25"})),l.a.createElement("div",{id:"resource-spec-section"},l.a.createElement("div",{id:"cpu-dropdown"},"CPU:",l.a.createElement("select",null,l.a.createElement("option",{value:"C2_2.4"},"2 Cores, 2.4 Ghz"),l.a.createElement("option",{value:"C6_3.6"},"6 Cores, 3.6 Ghz"),l.a.createElement("option",{value:"C8_4.1"},"6 Cores, 4.1 Ghz"),l.a.createElement("option",{value:"C8_3.2"},"8 Cores, 3.2 Ghz"),l.a.createElement("option",{value:"C16_4.1"},"16 Cores, 4.1 Ghz"))),l.a.createElement("div",{id:"resource-request-input"},l.a.createElement("div",{id:"ram-input"},"RAM (GB): ",l.a.createElement("input",null)),l.a.createElement("div",{id:"storage-input"},"Storage (GB): ",l.a.createElement("input",null)),l.a.createElement("div",{id:"network-down-input"},"Network Down (Mbps): ",l.a.createElement("input",null)),l.a.createElement("div",{id:"network-up-input"},"Network Up (Mbps): ",l.a.createElement("input",null)),l.a.createElement("div",{id:"encrypt-traffic"},"Encrypt Network Traffic: ",l.a.createElement("input",{type:"checkbox"})))),l.a.createElement("div",{id:"pre-config-resources"},l.a.createElement("table",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Select"),l.a.createElement("th",null,"Name"),l.a.createElement("th",null,"CPU"),l.a.createElement("th",null,"RAM"),l.a.createElement("th",null,"Storage"),l.a.createElement("th",null,"Network")),l.a.createElement("tr",{style:1===this.state.config?{background:"lightblue"}:{}},l.a.createElement("td",null,l.a.createElement("input",{value:"Select",type:"button",onClick:function(){return e.handleSelectConfig(1)}})),l.a.createElement("td",null,"Config 1"),l.a.createElement("td",null,"2 Cores 2.4GHz"),l.a.createElement("td",null,"8 GB"),l.a.createElement("td",null,"1 TB"),l.a.createElement("td",null,"10/10")),l.a.createElement("tr",{style:2===this.state.config?{background:"lightblue"}:{}},l.a.createElement("td",null,l.a.createElement("input",{value:"Select",type:"button",onClick:function(){return e.handleSelectConfig(2)}})),l.a.createElement("td",null,"Config 2"),l.a.createElement("td",null,"6 Cores 3.4GHz"),l.a.createElement("td",null,"16 GB"),l.a.createElement("td",null,"4 TB"),l.a.createElement("td",null,"100/100")),l.a.createElement("tr",{style:3===this.state.config?{background:"lightblue"}:{}},l.a.createElement("td",null,l.a.createElement("input",{value:"Select",type:"button",onClick:function(){return e.handleSelectConfig(3)}})),l.a.createElement("td",null,"Config 3"),l.a.createElement("td",null,"18 Cores 4.1GHz"),l.a.createElement("td",null,"32 GB"),l.a.createElement("td",null,"50 TB"),l.a.createElement("td",null,"100/50")),l.a.createElement("tr",{style:4===this.state.config?{background:"lightblue"}:{}},l.a.createElement("td",null,l.a.createElement("input",{value:"Select",type:"button",onClick:function(){return e.handleSelectConfig(4)}})),l.a.createElement("td",null,"Config 4"),l.a.createElement("td",null,"32 Cores 3.6GHz"),l.a.createElement("td",null,"64 GB"),l.a.createElement("td",null,"1 PB"),l.a.createElement("td",null,"50/50"))),l.a.createElement("div",{id:"submit-button"},l.a.createElement("button",null,"Submit Request")))))}}]),t}(a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},8:function(e,t,n){e.exports=n(16)}},[[8,1,2]]]);
//# sourceMappingURL=main.b7409e1c.chunk.js.map