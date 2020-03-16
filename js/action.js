/** @format */

let whichShown = "time",
	circleHovered = false;
$(function() {
	$(".baki-time").click(function() {
		$(this)
			.parent()
			.css({
				transform: "scale(0)",
			});
		$("#map-baki-time").addClass("map-baki-shown");
		$(".btn-back").addClass("btn-back-shown");
		$(".map-left .map-info").css({
			transform: "translateX(-90%) scale(.8)",
		});
		$(".map-right .map-info").css({
			transform: "translateX(90%) scale(.8)",
		});
	});

	$(".baki-percent").click(function() {
		$(this)
			.parent()
			.css({
				transform: "scale(0)",
			});
		$("#map-baki-percent").addClass("map-baki-shown");
		$(".btn-back").addClass("btn-back-shown");
		$(".map-left .map-info").css({
			transform: "translateX(-90%) scale(.8)",
		});
		$(".map-right .map-info").css({
			transform: "translateX(90%) scale(.8)",
		});
	});

	// $(".baki").mouseover(function() {
	// 	$(this).css("transform", "scale(1.1)");
	// });
	// $(".baki").mouseout(function() {
	// 	$(this).css("transform", "scale(1)");
	// });

	const $description = $(".tooltip");
	$("body").on("mousemove", "#sgs-time", function(e) {
		$description.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 80,
		});
		const checkHover = e.target.classList.contains("circle");
		if (!checkHover) {
			$description.removeClass("tooltip-shown");
		}
	});
	$("body").on("mousemove", "#sgs-percent", function(e) {
		$description.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 80,
		});
	});
	$("body").on("mousemove", "#map-baki-percent-svg", function(e) {
		$description.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 80,
		});
		const checkHover = e.target.classList.contains("circle");
		if (!checkHover) {
			$description.removeClass("tooltip-shown");
		}
	});
	$("body").on("mousemove", "#map-baki-time-svg", function(e) {
		$description.css({
			left: e.pageX,
			top: e.pageY < 230 ? 230 - 80 : e.pageY - 80,
		});
	});

	let hoverTimer;
	function setHoverData(e) {
		if (circleHovered) {
			if (element == e) {
				document.getElementById("tooltip-time").innerHTML = e.getAttribute(
					"data-awg-text",
				);
				hoverTimer = setTimeout(() => setHoverData(e), 1000);
			}
		}
	}

	let event, element;

	const setPercentTooltipColor = percent => {
		if (percent < 10) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#5aaf2b";
		} else if (percent >= 10 && percent <= 15) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#f8c43d";
		} else if (percent >= 15 && percent <= 25) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#ef874c";
		} else if (percent >= 25) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#e43e3d";
		}
	};

	const setTImeTooltipColor = time => {
		if (time > 600 && time <= 900) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#f8c43d";
		} else if (time > 900 && time <= 1200) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#ef874c";
		} else if (time > 1200) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#e43e3d";
		} else if (time < 600) {
			document.getElementsByClassName("tooltip")[0].style.backgroundColor =
				"#5aaf2b";
		}
	};

	$(".map-wrap").on("mouseover", ".circle", function(e) {
		$description.addClass("tooltip-shown");
		$("#tooltip-filname").text($(this).attr("data-filialname"));
		circleHovered = true;
		(event = e.target), (element = e.target);
		let circleType = event.getAttribute("data-type");

		if (circleType === "time") {
			const data = event.getAttribute("data-awg-text");
			document.getElementById("tooltip-percent").innerHTML = "";
			document.getElementById("tooltip-time").innerHTML = data;
			let time = data.split(":");
			let sec =
				parseInt(time[0] * 360) + parseInt(time[1] * 60) + parseInt(time[2]);
			console.log("time", sec);
			setTImeTooltipColor(sec);
		} else {
			document.getElementById("tooltip-percent").innerHTML =
				event.getAttribute("data-percent-text") + " %";
			document.getElementById("tooltip-time").innerHTML = "";
			let colorTooltip = "";
			let percentTooltip = event.getAttribute("data-percent-text");
			setPercentTooltipColor(percentTooltip);
		}

		hoverTimer = setTimeout(() => setHoverData(event), 1000);
	});

	$(".map-wrap").on("mouseout", ".circle", function() {
		$description.removeClass("tooltip-shown");
		clearTimeout(hoverTimer);
		circleHovered = false;
	});

	$(".btn-back").click(function() {
		if (whichShown == "time") {
			$("#sgs-time").css({
				transform: "scale(1)",
			});
		} else {
			$("#sgs-percent").css({
				transform: "scale(1)",
			});
		}
		$(".map-baki").removeClass("map-baki-shown");
		$(".btn-back").removeClass("btn-back-shown");
		$(".map-left .map-info").css({
			transform: "translateX(0) scale(1)",
		});
		$(".map-right .map-info").css({
			transform: "translateX(0) scale(1)",
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
			transform: "translateX(0) scale(1)",
		});
		$(".map-right .map-info").css({
			transform: "translateX(0) scale(1)",
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
			transform: "translateX(0) scale(1)",
		});
		$(".map-right .map-info").css({
			transform: "translateX(0) scale(1)",
		});
		$(".btn-back").removeClass("btn-back-shown");
	});

	$(document).on("click", ".circle", function() {
		const ID = $(this).attr("data-id");
		window.open(`/heatmap/department/?branch=${ID}`, "_blank");
	});
});
