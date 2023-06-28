const id = "show-site-ip-abcd";
chrome.runtime.onMessage.addListener(function (request) {
   const old = document.querySelector(`#${id}`);
   if (old) {
      old.remove();
   }
   const ip = document.createElement("DIV");
   ip.textContent = request.ip;
   ip.setAttribute("style", (
       "background-color:gray;"
       + "color:red;"
      + "width:100%;"
      + "height:50px;"
      + "font-size:38px;"
      + "text-align:center"
   ));
   ip.id = id;
   document.body.prepend(ip);
});
