var stickies = [];

deleteSticky = function deleteSticky(id) {
  localStorage.removeItem("sticky-" + id);
  removeKey(id);
  $("#" + id).fadeOut(200, function () { $(this).remove(); });
}

removeKey = function removeKey(id) {
  var i = 0, keys = JSON.parse(localStorage.getItem("keys")) || [];
  while (i < keys.length) {
    if (keys[i] == id) {
      keys.splice(i, 1);
    } else {
      i++;
    }
  }
  localStorage.setItem("keys", JSON.stringify(keys));  
}

addKey = function addKey(id) {
  keys = JSON.parse(localStorage.getItem("keys")) || [];
  keys.push(id);
  localStorage.setItem("keys", JSON.stringify(keys));  
}

saveSticky = function saveSticky() {
  var that = $(this), 
  sticky = (that.hasClass("sticky-status") || that.hasClass("sticky-content")) ? that.parents('li.sticky'): that,
  obj = {
    id  : sticky.attr("id"),
    text: sticky.children(".sticky-content").html()
  }
  localStorage.setItem("sticky-" + obj.id, JSON.stringify(obj));
  addKey(obj.id);
  sticky.find(".sticky-status").text("Salvo");
}

markUnsaved = function markUnsaved() {
  var that = $(this), sticky = that.hasClass("sticky-content") ? that.parents("li.sticky") : that;
  sticky.find(".sticky-status").text("Salvar Recado");
}

$("#add").click(function(e) {
  e.preventDefault();
  data = { id : +new Date(), text : "Oi" }
  return theSticky(data);
})

theSticky = function theSticky(data) {
  return $("<li />", { 
    "class" : "sticky",
    'id' : data.id
     })
    .prepend($("<div />", { "class" : "sticky-header"} )
      .append($("<span />", { 
        "class" : "sticky-status", 
        text : "Salvar Recado", 
        click : saveSticky 
      }))
      .append($("<span />", { 
        "class" : "close-sticky", 
        text : "Deletar Recado", 
        click : function () { deleteSticky($(this).parents(".sticky").attr("id")); }
      }))
    )
    .append($("<div />", { 
      html : data.text, 
      contentEditable : true, 
      keypress : markUnsaved, 
      "class" : "sticky-content"
    }))
  .focusout(saveSticky)
  .appendTo($("#notes"));
}

showStickies = function() {
  keys = JSON.parse(localStorage.getItem("keys"));
  if (keys) {
    $.each(keys, function(index, value) {
      if (localStorage.getItem("sticky-" + value)) {
        return theSticky(JSON.parse(localStorage.getItem("sticky-" + value)));
      }
    });
  }
}

showStickies();