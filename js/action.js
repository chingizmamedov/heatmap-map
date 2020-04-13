/** @format */

let whichShown = "time",
	circleHovered = false,
	event,
	element;
$(function() {
	$(".baki-time").click(function() {
		$(this)
			.parent()
			.css({
				transform: "scale(0)"
			});
		$("#map-baki-time").addClass("map-baki-shown");
		$(".btn-back").addClass("btn-back-shown");
		$(".map-left .map-info").css({
			transform: "translateX(-90%) scale(.8)"
		});
		$(".map-right .map-info").css({
			transform: "translateX(90%) scale(.8)"
		});
	});

	$(".baki-percent").click(function() {
		$(this)
			.parent()
			.css({
				transform: "scale(0)"
			});
		$("#map-baki-percent").addClass("map-baki-shown");
		$(".btn-back").addClass("btn-back-shown");
		$(".map-left .map-info").css({
			transform: "translateX(-90%) scale(.8)"
		});
		$(".map-right .map-info").css({
			transform: "translateX(90%) scale(.8)"
		});
	});
	const TOOLTIP = $(".tooltip-float");
	$("body").on("mousemove", "#sgs-time", function(e) {
		TOOLTIP.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 100
		});
		const checkHover = e.target.classList.contains("circle");
		if (!checkHover) {
			TOOLTIP.removeClass("tooltip-float-shown");
		} else {
			TOOLTIP.addClass("tooltip-float-shown");
		}
	});
	$("body").on("mousemove", "#sgs-percent", function(e) {
		TOOLTIP.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 100
		});
		const checkHover = e.target.classList.contains("circle");
		if (!checkHover) {
			TOOLTIP.removeClass("tooltip-float-shown");
		} else {
			TOOLTIP.addClass("tooltip-float-shown");
		}
	});
	$("body").on("mousemove", "#map-baki-percent-svg", function(e) {
		TOOLTIP.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 100
		});
		const checkHover = e.target.classList.contains("circle");
		if (!checkHover) {
			TOOLTIP.removeClass("tooltip-float-shown");
		} else {
			TOOLTIP.addClass("tooltip-float-shown");
		}
	});
	$("body").on("mousemove", "#map-baki-time-svg", function(e) {
		TOOLTIP.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 100
		});
		const checkHover = e.target.classList.contains("circle");
		if (!checkHover) {
			TOOLTIP.removeClass("tooltip-float-shown");
		} else {
			TOOLTIP.addClass("tooltip-float-shown");
		}
	});

	let hoverTimer;
	function setHoverData(e) {
		if (circleHovered) {
			if (element == e) {
				// document.getElementById(
				// 	"tooltip-float-time",
				// ).innerHTML = e.getAttribute("data-awg-text");
				// document.getElementById(
				// 	"tooltip-float-percent",
				// ).innerHTML = e.getAttribute("data-awg-text");
				hoverTimer = setTimeout(() => setHoverData(e), 3000);
			}
		}
	}

	const setPercentTooltipColor = percent => {
		if (percent < 10) {
			TOOLTIP.style.backgroundColor = "#5aaf2b";
		} else if (percent >= 10 && percent <= 15) {
			TOOLTIP.style.backgroundColor = "#f8c43d";
		} else if (percent >= 15 && percent <= 25) {
			TOOLTIP.style.backgroundColor = "#ef874c";
		} else if (percent >= 25) {
			TOOLTIP.style.backgroundColor = "#e43e3d";
		}
	};

	const setTImeTooltipColor = time => {
		if (time > 600 && time <= 900) {
			TOOLTIP.css("background", "#f8c43d");
		} else if (time > 900 && time <= 1200) {
			TOOLTIP.css("background", "#ef874c");
		} else if (time > 1200) {
			TOOLTIP.css("background", "#e43e3d");
		} else if (time < 600) {
			TOOLTIP.css("background", "#5aaf2b");
		}
	};

	$(".map-wrap").on("mouseover", ".circle", function(e) {
		TOOLTIP.addClass("tooltip-float-shown");
		$("#tooltip-float-filname").text($(this).attr("data-filialname"));
		circleHovered = true;
		event = e.target;
		element = e.target;
		let circleType = event.getAttribute("data-type");

		if (circleType === "time") {
			const data = event.getAttribute("data-awg-text");
			document.getElementById("tooltip-float-percent").innerHTML = "";
			document.getElementById("tooltip-float-time").innerHTML = data;
			let time = data.split(":");
			let sec =
				parseInt(time[0] * 360) + parseInt(time[1] * 60) + parseInt(time[2]);
			setTImeTooltipColor(sec);
		} else {
			document.getElementById("tooltip-float-percent").innerHTML =
				event.getAttribute("data-percent-text") + " %";
			document.getElementById("tooltip-float-time").innerHTML = "";
			let colorTooltip = "";
			let percentTooltip = event.getAttribute("data-percent-text");
			setPercentTooltipColor(percentTooltip);
		}

		hoverTimer = setTimeout(() => setHoverData(event), 1000);
	});

	$(".map-wrap").on("mouseout", ".circle", function() {
		TOOLTIP.removeClass("tooltip-float-shown");
		clearTimeout(hoverTimer);
		circleHovered = false;
	});

	$(".btn-back").click(function() {
		if (whichShown == "time") {
			$("#sgs-time").css({
				transform: "scale(1)"
			});
		} else {
			$("#sgs-percent").css({
				transform: "scale(1)"
			});
		}
		$(".map-baki").removeClass("map-baki-shown");
		$(".btn-back").removeClass("btn-back-shown");
		$(".map-left .map-info").css({
			transform: "translateX(0) scale(1)"
		});
		$(".map-right .map-info").css({
			transform: "translateX(0) scale(1)"
		});
	});
	$("#tab-time").click(function() {
		$("#sgs-time").addClass("sgs-animation");
		$("#sgs-percent").addClass("sgs-animation");
		$(".tab-btn").removeClass("tab-btn__active");
		$(this)
			.find(".tab-btn")
			.addClass("tab-btn__active");
		$(".map-baki").removeClass("map-baki-shown");
		whichShown = "time";
		$("#map-percent").removeClass("d-flex");
		$("#map-percent").addClass("d-none");
		$("#map-time").addClass("d-flex");
		$("#sgs-time").css("transform", "scale(1)");
		$("#map-time").removeClass("d-none");
		$(".map-left .map-info").css({
			transform: "translateX(0) scale(1)"
		});
		$(".map-right .map-info").css({
			transform: "translateX(0) scale(1)"
		});
		$(".btn-back").removeClass("btn-back-shown");
	});
	$("#tab-percent").click(function() {
		$("#sgs-time").addClass("sgs-animation");
		$("#sgs-percent").addClass("sgs-animation");
		$(".tab-btn").removeClass("tab-btn__active");
		$(this)
			.find(".tab-btn")
			.addClass("tab-btn__active");
		$(".map-baki").removeClass("map-baki-shown");
		whichShown = "percent";
		$("#map-percent").addClass("d-flex");
		$("#map-percent").removeClass("d-none");
		$("#sgs-percent").css("transform", "scale(1)");
		$("#map-time").removeClass("d-flex");
		$("#map-time").addClass("d-none");
		$(".map-left .map-info").css({
			transform: "translateX(0) scale(1)"
		});
		$(".map-right .map-info").css({
			transform: "translateX(0) scale(1)"
		});
		$(".btn-back").removeClass("btn-back-shown");
	});

	$(document).on("click", ".circle", function() {
		const ID = $(this).attr("data-id");
		window.open(`/heatmap/department/?branch=${ID}`, "_blank");
	});
});
