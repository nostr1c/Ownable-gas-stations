var blipColors = ["#fefefe", "#e03232", "#71cb71", "#5db6e5", "#fefefe", "#eec64e", "#c25050", "#9c6eaf", "#fe7ac3", "#f59d79", "#b18f83", "#8dcea7", "#70a8ae", "#d3d1e7", "#8f7e98", "#6ac4bf", "#d5c398", "#ea8e50", "#97cae9", "#b26287", "#8f8d79", "#a6755e", "#afa8a8", "#e78d9a", "#bbd65b", "#0c7b56", "#7ac3fe", "#ab3ce6", "#cda80c", "#4561ab", "#29a5b8", "#b89b7b", "#c8e0fe", "#f0f096", "#ed8ca1", "#f98a8a", "#fbeea5", "#fefefe", "#2c6db8", "#9a9a9a", "#4c4c4c", "#F29D9D", "#6CB7D6", "#AFEDAE", "#FFA75F", "#F1F1F1", "#ECF029", "#FF9A18", "#F644A5", "#E03A3A", "#8A6DE3", "#FF8B5C", "#416C41", "#B3DDF3", "#3A6479", "#A0A0A0", "#847232", "#65B9E7", "#4B4175", "#E13B3B", "#F0CB58", "#CD3F98", "#CFCFCF", "#276A9F", "#D87B1B", "#8E8393", "#F0CB57", "#65B9E7", "#65B9E7", "#79CD79", "#EFCA57", "#EFCA57", "#3D3D3D", "#EFCA57", "#65B9E7", "#e03232", "#782323", "#65B9E7", "#3A6479", "#e03232", "#65B9E7", "#F2A40C", "#A4CCAA", "#A854F2", "#65B9E7", "#3D3D3D"];
var confirmationCallback = null;
var tankPercent = 50    ; // remove
var elPercent = 50;

$(document).ready(function() {
    $(document).on("mouseenter", "#nozzle-area", function(e) {
        $("#nozzle-img").css({ 
            filter: "drop-shadow(0 0 0.5vw red)",
        });
    })

    $(document).on("mouseleave", "#nozzle-area", function(e) {
        $("#nozzle-img").css("filter", "none");
    })

    $(document).on("click", ".modal-header i, .modal-cancel", function(e) {
        $(".modal, #modals").fadeOut();
    })

    $(document).on("click", "#money-action-btn", function(e) {
        let action = $(this).data("action");
        handleMoneyAction(action);
    })

    $(document).on("click", ".money-btn", function(e) {
        let action = $(this).data("action");
        moneyAction(action);
    })

    $(document).on("click", ".boss-sidemenu-child", function(e) {
        let pageToOpen = $(this).data("page");
        $(".boss-sidemenu-child").removeClass("sidemenu-active");
        $(this).addClass("sidemenu-active");
        $(".page").hide();
        $(`#${pageToOpen}-wrapper`).show();

        $("#boss-sidemenu-money").removeClass("boss-sidemenu-money-active")
        $("#money-parent").hide()
    })

    setTankPercent();
    setElPercent();
    setUpBlipColors()

    if (tankPercent <=5 ) {
        notify({type: "error", title: "Warning", text: "Running on a tank value of lower than 5% in more than three days will result in a terminated business", duration: 7000});
    }

    $(document).on("click", ".store-child:not(.unavailable)", function(e) {
        this.package = $(this).data("item");
        confirm(this, buyPackage, true);
    })

    $(document).on("click", ".modal-yes", function(e) {
        confirm(null, null, false);
    })

    $(document).on("click", "#admin-form-sale-toggle", function(e) {
        let isForSale = $(this).data("forsale");
        handleForSale(isForSale);
    })

    $(document).on("click", ".users-add", function(e) {
        $("#users-add-child-wrapper").fadeIn();
    })

    $(document).on("click", "#users-add-cancel", function(e) {
        $("#users-add-child-wrapper").fadeOut();
    })

    $(document).on("click", ".admin-form-blip-color", function(e) {
        $(".admin-form-blip-color").removeClass("admin-form-blip-color-selected");
        $(this).addClass("admin-form-blip-color-selected");
    })

    $(document).on("click", "#boss-sidemenu-money", function(e) {
        if (!$(this).hasClass("boss-sidemenu-money-active")) {
            $(this).addClass("boss-sidemenu-money-active")
            $("#money-parent").show()
        } else {
            $(this).removeClass("boss-sidemenu-money-active")
            $("#money-parent").hide()
        }
    })
})

function setTankPercent() {
    let percent = tankPercent; // let percent = 5;

    let newPercent = -30 + percent;
    let bottomPercent = 130 - percent;

    $("#fill-svg svg").css("bottom", `${newPercent}%`);
    $("#fill-bottom").css("top", `${bottomPercent}%`);

    $("#tank-percent").html(`${percent}%`);

    if (percent >= 65) {
        var color = "#dfdddd";
    } else {
        var color = "#999999";
    }

    $("#tank-percent").css("color", color);
}
function setElPercent() {
    $("#el-percent").html(`${elPercent}%`);
    $("#el-fill").css("height", `${elPercent}%`);
}
function notify(data) {
    let icon = data.type == "error" ? "fa-triangle-exclamation" : data.type == "success" ? "fa-check" : "";
    let html = `
        <div class="notify-child notify-${data.type}">
            <div class="notify-icon">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="notify-text">
                <span class="notify-title">${data.title}</span>
                <span class="notify-content">${data.text}</span>
            </div>
            <div class="notify-bar"></div>
        </div>
    `;

    $(html).appendTo("#notify-parent")
    .animate({right: "18vw"}, 200)
    .delay(data.duration)
    .animate({right: "0vw"}, 200)
    .queue(function() {
        $(this).remove();
    });
    $(".notify-bar").animate({width: 0}, data.duration + 500);

}
function moneyAction(action) {
    $("#modals, #money-action").fadeIn();
    let modal = $("#money-action");
    let title = action == "deposit" ? "Deposit" : action == "withdraw" ? "Withdraw" : "";
    let subTitle = action == "deposit" ? "How much would you like to deposit" : action == "withdraw" ? "How much would you like to withdraw" : "";
    modal.find(".modal-title, .modal-submit").html(title);
    modal.find(".modal-subtitle").html(subTitle);
    modal.find("#money-action-btn").data("action", action);
}
function handleMoneyAction(action) {
    let amount = $("#money-action-amount").val();

    // fetch(`https://${GetParentResourceName()}/moneyAction`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json; charset=UTF-8",
    //     },
    //     body: JSON.stringify({
    //         action: action,
    //         amount: amount
    //     })
    // }).then(resp => resp.json()).then(resp => {
    //     console.log(JSON.stringify(resp));
    // });
}
function confirm(data, callback, isCallback) {
    $("#modals, #confirm").fadeIn();
    if (isCallback) {
        confirmationCallback = callback;
        newData = data;
    } else {
        confirmationCallback(newData)
        $(".modal, #modals").fadeOut();
    }
}
function buyPackage(data) {
    console.log(data.package)

    // fetch(`https://${GetParentResourceName()}/moneyAction`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json; charset=UTF-8",
    //     },
    //     body: JSON.stringify({
    //         package: data.package
    //     })
    // }).then(resp => resp.json()).then(resp => {
    //     console.log(JSON.stringify(resp));
    // });
}
function handleForSale(isForSale) {
    if (!isForSale) {
        $("#admin-form-sale-toggle").css("background-color", "#c1ff97")
        .find("span").html("For sale")
        .parent().data("forsale", true);
        $("#admin-form-sale-input").fadeIn();
    } else {
        $("#admin-form-sale-toggle").css("background-color", "#ff9797")
        .find("span").html("Not for sale")
        .parent().data("forsale", false);
        $("#admin-form-sale-input").fadeOut();
    }
}
function setUpBlipColors() {
    $.each(blipColors, (k, v) => {
        let html = `
            <div data-id="${k}" class="admin-form-blip-color" style="background-color:${v};"></div>
        `;
        $(".admin-form-blip-colors").append(html);
    });
}