$(function() {

  $.ajax({
    type: "get",
    url: "/rest/servicepoint/user/",
    success: function(response) {
      console.log("response", response)
      $(".name").text(response["fullName"]);
    },
    error: function() {
      window.location.href = "/login.jsp";
    }
  });

  let testData = 0,
    limit = 20,
    offset = 0,
    search = "",
    searchFetch = false,
    valLength;
  firstLoad = false;
  let parseData = {},
    editableData = {};
  const service = new WebSocket("ws://10.0.22.36:8000/branches/");

  service.onopen = function() {
    service.send(
      JSON.stringify({
        action: "get_branches",
        payload: {
          limit: 20,
          offset: 0,
          search: ""
        }
      })
    );
  };

  service.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("TCL: service.onmessage -> data", data);
    if (data.action === "get_branches") {
      testData = data.payload.count;
      firstLoad ? null : setpagination();
      firstLoad = true;
      if (data.payload.search) {
        searchFetch = true;
      } else {
        searchFetch = false;
      }
      sortParseData(data.payload.branches);
    }
    if (data.action === "update_branch") {
      updateSortParseData(data.payload);
    }
    if (data.action === "update_department") {
      updateSortParseDataDepartament(data.payload);
    }
  };

  // изменения филлиалов
  function updateSortParseData(data) {
    for (let [key, value] of Object.entries(data)) {
      parseData[data.id][key] = value;
      if (key === "max_free_time") {
        if (value.dinamic === false) {
          editableData[data.id].dinamic = false;
          editableData[data.id].calculation_time = value.calculation_time;
          editableData[data.id].coefficient = value.coefficient;
          editableData[data.id].value = value.value;
          $(`[data-name='${key}'][data-parent-id='${data.id}']`).text(
            value.text
          );
        }
        if (value.dinamic === true) {
          editableData[data.id] = {};
          editableData[data.id].calculation_time = value.calculation_time;
          editableData[data.id].coefficient = value.coefficient;
          editableData[data.id].value = value.value;
          $(`[data-name='${key}'][data-parent-id='${data.id}']`).text(
            value.text
          );
        }
      } else {
        $(`[data-name='${key}'][data-parent-id='${data.id}']`).text(value);
      }
    }
  }

  // изменения департаментов
  function updateSortParseDataDepartament(data) {
    let changeKeys = [];
    for (let [key, value] of Object.entries(data)) {
      if (key === "branch_id" || key == "id") {
        null;
      } else {
        changeKeys.push([key, value]);
      }
    }

    changeKeys.map(itemKey => {
      parseData[data.branch_id].departments.map((item, index) => {
        if (item.id === data.id) {
          item[itemKey[0]] = itemKey[1];
          parseData[data.branch_id].departments[index][itemKey[0]] = itemKey[1];
          $(`[data-name='${itemKey[0]}'][data-id='${data.id}']`).text(
            itemKey[1]
          );
        }
      });
    });
  }

  function drowTable(data) {
    drowTableNames(data);
  }

  function drowTableNames(data) {
    console.log("parse data", data);
    let namesTable = "";
    for (let [key] of Object.entries(data)) {
      console.log("TCL: drowTableNames -> key", key);
      console.log("TCL: drowTableNames -> data", data);
      namesTable += `<tr><td>
          <span>
            <a class="branch-link" href="/department/?id=${key}">
              ${
                data[key].name.length > 16
                  ? data[key].name.slice(0, 16) + "..."
                  : data[key].name
              }
            </a>
          </span>
        </td>
      </tr>`;
    }
    if (searchFetch) {
      $(".search-names-tbody").html("");
      $(".search-names-tbody").html(namesTable);
    } else {
      $(".names-tbody").html("");
      $(".names-tbody").html(namesTable);
    }

    drowTableTotal(data);
  }

  function drowTableTotal(data) {
    let totalTableRow = "";
    for (let [keyParent, value] of Object.entries(parseData)) {
      totalTableRow += "<tr>";
      for (let [key, valueEntry] of Object.entries(value)) {
        if (
          key === "id" ||
          key === "name" ||
          key === "departments" ||
          key === "open_counter_count"
        ) {
          null;
        } else {
          totalTableRow += `<td data-parent-id="${keyParent}" data-name="${key}" ${
            key === "max_free_time" ? "id=" + keyParent + "" : ""
          }>${key === "max_free_time" ? valueEntry.text : valueEntry} </td>`;
        }
      }
      totalTableRow += "</tr>";
    }
    if (searchFetch) {
      $(".search-total-tbody").html("");
      $(".search-total-tbody").html(totalTableRow);
    } else {
      $(".total-tbody").html("");
      $(".total-tbody").html(totalTableRow);
    }
    drowServicesDepartment();
  }

  function drowServicesDepartment(data) {
    let servicesTableRow = "";

    for (let [keyParent, value] of Object.entries(parseData)) {
      const departamentsArray = Object.values(value.departments);
      servicesTableRow += "<tr>";
      if (departamentsArray[0] == null || departamentsArray[0] == undefined) {
        for (let i = 0; i < 8; i++) {
          servicesTableRow += '<td data-name="nothing">---</td>';
        }
      } else {
        for (let [key, value] of Object.entries(departamentsArray[0])) {
          if (key === "name" || key === "id" || key === "branch_id") {
            null;
          } else {
            servicesTableRow += `<td data-id="${departamentsArray[0].id}" data-name="${key}">${value}</td>`;
          }
        }
      }
      servicesTableRow += "</tr>";
    }
    if (searchFetch) {
      $(".search-services-tbody").html("");
      $(".search-services-tbody").html(servicesTableRow);
    } else {
      $(".services-tbody").html("");
      $(".services-tbody").html(servicesTableRow);
    }

    drowSalesDepartment();
  }

  function drowSalesDepartment(data) {
    let salesTableRow = "";

    for (let [key, value] of Object.entries(parseData)) {
      const departamentsArray = Object.values(value.departments);
      salesTableRow += "<tr>";
      if (departamentsArray[1] == null || departamentsArray[1] == undefined) {
        for (let i = 0; i < 8; i++) {
          salesTableRow += '<td data-name="nothing">---</td>';
        }
      } else {
        for (let [key, value] of Object.entries(departamentsArray[1])) {
          if (key === "name" || key === "id" || key === "branch_id") {
            null;
          } else {
            salesTableRow += `<td data-id="${departamentsArray[1].id}" data-name="${key}">${value}</td>`;
          }
        }
      }
      salesTableRow += "</tr>";
    }
    if (searchFetch) {
      $(".search-sales-tbody").html("");
      $(".search-sales-tbody").html(salesTableRow);
    } else {
      $(".sales-tbody").html("");
      $(".sales-tbody").html(salesTableRow);
    }

    drowCashDepartment();
  }

  function drowCashDepartment(data) {
    let cashTableRow = "";

    for (let [key, value] of Object.entries(parseData)) {
      const departamentsArray = Object.values(value.departments);
      cashTableRow += "<tr>";
      if (departamentsArray[2] == null || departamentsArray[2] == undefined) {
        for (let i = 0; i < 8; i++) {
          cashTableRow += '<td data-name="nothing">---</td>';
        }
      } else {
        for (let [key, value] of Object.entries(departamentsArray[2])) {
          if (key === "name" || key === "id" || key === "branch_id") {
            null;
          } else {
            cashTableRow += `<td data-id="${departamentsArray[2].id}" data-name="${key}">${value}</td>`;
          }
        }
      }
      cashTableRow += "</tr>";
    }
    if (searchFetch) {
      $(".search-cash-tbody").html("");
      $(".search-cash-tbody").html(cashTableRow);
    } else {
      $(".cash-tbody").html("");
      $(".cash-tbody").html(cashTableRow);
    }

    drowLegalDepartment();
  }

  function drowLegalDepartment(data) {
    let legalTableRow = "";

    for (let [key, value] of Object.entries(parseData)) {
      const departamentsArray = Object.values(value.departments);
      legalTableRow += "<tr>";
      if (departamentsArray[3] == null || departamentsArray[3] == undefined) {
        for (let i = 0; i < 8; i++) {
          legalTableRow += '<td data-name="nothing">---</td>';
        }
      } else {
        for (let [key, value] of Object.entries(departamentsArray[3])) {
          if (key === "name" || key === "id" || key === "branch_id") {
            null;
          } else {
            legalTableRow += `<td data-id="${departamentsArray[3].id}" data-name="${key}">${value}</td>`;
          }
        }
      }

      legalTableRow += "</tr>";
    }
    if (searchFetch) {
      $(".search-legal-tbody").html("");
      $(".search-legal-tbody").html(legalTableRow);
    } else {
      $(".legal-tbody").html("");
      $(".legal-tbody").html(legalTableRow);
    }
    drowLegalCashDepartment();
  }

  function drowLegalCashDepartment(data) {
    let legalTableRow = "";

    for (let [key, value] of Object.entries(parseData)) {
      const departamentsArray = Object.values(value.departments);
      legalTableRow += "<tr>";
      if (departamentsArray[4] == null || departamentsArray[4] == undefined) {
        for (let i = 0; i < 8; i++) {
          legalTableRow += '<td data-name="nothing">---</td>';
        }
      } else {
        for (let [key, value] of Object.entries(departamentsArray[4])) {
          if (key === "name" || key === "id" || key === "branch_id") {
            null;
          } else {
            legalTableRow += `<td data-id="${departamentsArray[4].id}" data-name="${key}">${value}</td>`;
          }
        }
      }

      legalTableRow += "</tr>";
    }
    if (searchFetch) {
      $(".search-legal-cash-tbody").html("");
      $(".search-legal-cash-tbody").html(legalTableRow);
      if (valLength > 2) {
        if (Object.keys(parseData).length < 1) {
          $(".flash").css("right", "20px");
          setTimeout(() => {
            $(".flash").css("right", "-120%");
          }, 5800);
        } else {
          $(".search-wrap").slideDown();
          $(".table-main-block").css("opacity", 0);
          $(".pagination-wrap").css("opacity", 0);
          $(".search-preloader").css("transform", "scaleY(0)");
        }
      }
    } else {
      $(".legal-cash-tbody").html("");
      $(".legal-cash-tbody").html(legalTableRow);
      $(".preloader-fetch").css("display", "none");
      setTimeout(() => {
        $("#preloader").hide();
      }, 800);
    }
  }

  function sortParseData(data) {
    parseData = {};
    data.map(item => {
      parseData[item.id] = {};
      for (let [key, value] of Object.entries(item)) {
        if (key === "max_free_time") {
          if (value.dinamic === true) {
            editableData[item.id] = {};
            editableData[item.id].calculation_time = value.calculation_time;
            editableData[item.id].coefficient = value.coefficient;
            editableData[item.id].value = value.value;
            editableData[item.id].dinamic = true;
          }
        }
        parseData[item.id][key] = value;
      }
    });
    drowTable(parseData);
    updateData();
  }

  function updateData() {
    for (let [key, value] of Object.entries(editableData)) {
      let updateElem = document.getElementById(key);
      if (value.dinamic === false) {
        updateElem.style.color = "#000";
        updateElem.innerText = "0:00:00";
      } else {
        let delta = Date.now() - new Date(value.calculation_time).getTime();
        let ms = delta * value.coefficient;
        let val = new Date(value.value + ms);
        let fullMs = value.value + ms;
        let displayDate =
          val.getUTCHours() +
          ":" +
          (val.getMinutes() < 10 ? "0" + val.getMinutes() : val.getMinutes()) +
          ":" +
          (val.getSeconds() < 10 ? "0" + val.getSeconds() : val.getSeconds());
        if (updateElem == null) {
          null;
        } else {
          if (fullMs > 300000 && fullMs < 600000) {
            updateElem.style.color = "green";
          } else if (fullMs > 600000) {
            updateElem.style.color = "red";
          } else if (fullMs < 300000) {
            updateElem.style.color = "#000";
          }
          updateElem.innerText = displayDate;
        }
      }
    }
    setTimeout(updateData, 1000);
  }

  /**
   * tabs
   */

  $("#tab-total").click(function() {
    $(".total").css("margin-left", 0);
    $(".table-controller-item").removeClass("table-controller-item-active");
    $(this).addClass("table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#tab-Xidmet").click(function() {
    $(".total").css("margin-left", "-100%");
    $(".table-controller-item").removeClass("table-controller-item-active");
    $(this).addClass("table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#tab-Satish").click(function() {
    $(".total").css("margin-left", "-200%");
    $(".table-controller-item").removeClass("table-controller-item-active");
    $(this).addClass("table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#tab-Kassa").click(function() {
    $(".total").css("margin-left", "-300%");
    $(".table-controller-item").removeClass("table-controller-item-active");
    $(this).addClass("table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#tab-Huquqi").click(function() {
    $(".total").css("margin-left", "-400%");
    $(".table-controller-item").removeClass("table-controller-item-active");
    $(this).addClass("table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#tab-shexsler").click(function() {
    $(".total").css("margin-left", "-500%");
    $(".table-controller-item").removeClass("table-controller-item-active");
    $(this).addClass("table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });

  /**
   * search tabs
   */

  $("#search-tab-total").click(function() {
    $(".total").css("margin-left", 0);
    $(".search-table-controller-item").removeClass(
      "search-table-controller-item-active"
    );
    $(this).addClass("search-table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#search-tab-Xidmet").click(function() {
    $(".total").css("margin-left", "-100%");
    $(".search-table-controller-item").removeClass(
      "search-table-controller-item-active"
    );
    $(this).addClass("search-table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#search-tab-Satish").click(function() {
    $(".total").css("margin-left", "-200%");
    $(".search-table-controller-item").removeClass(
      "search-table-controller-item-active"
    );
    $(this).addClass("search-table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#search-tab-Kassa").click(function() {
    $(".total").css("margin-left", "-300%");
    $(".search-table-controller-item").removeClass(
      "search-table-controller-item-active"
    );
    $(this).addClass("search-table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#search-tab-Huquqi").click(function() {
    $(".total").css("margin-left", "-400%");
    $(".search-table-controller-item").removeClass(
      "search-table-controller-item-active"
    );
    $(this).addClass("search-table-controller-item-active");
    const TABNAME = $(this).text();
    $(".table-name").text(TABNAME);
  });
  $("#search-tab-shexsler").click(function() {
    $(".total").css("margin-left", "-500%");
    $(".search-table-controller-item").removeClass(
      "search-table-controller-item-active"
    );
    $(this).addClass("search-table-controller-item-active");
    const TABNAME = $(this).text();
    console.log("TCL: TABNAME", TABNAME);
    $(".table-name").text(TABNAME);
  });
  function setpagination() {
    const sourseArray = [];
    for (let i = 0; i < testData; i++) {
      sourseArray.push(i);
    }
    $("#pagination-container").pagination({
      dataSource: sourseArray,
      locator: "items",
      totalNumber: sourseArray,
      pageSize: limit,
      beforePageOnClick: function(e, pagination) {
        $(".preloader-fetch").css("display", "flex");
        offset = limit * (pagination - 1);
        service.send(
          JSON.stringify({
            action: "get_branches",
            payload: {
              limit: limit,
              offset: offset,
              search: ""
            }
          })
        );
      },
      beforePreviousOnClick: function(e, pagination) {
        $(".preloader-fetch").css("display", "flex");
        offset = limit * (pagination - 1);
        service.send(
          JSON.stringify({
            action: "get_branches",
            payload: {
              limit: limit,
              offset: offset,
              search: ""
            }
          })
        );
      },
      beforeNextOnClick: function(e, pagination) {
        $(".preloader-fetch").css("display", "flex");
        offset = limit * (pagination - 1);
        service.send(
          JSON.stringify({
            action: "get_branches",
            payload: {
              limit: limit,
              offset: offset,
              search: ""
            }
          })
        );
      },
      callback: function(data, pagination) {
        // console.log("TCL: setpagination -> pagination", pagination);
      }
    });
  }

  $("#search").on("input", function(e) {
    valLength = $(this).val().length;
    const text = $(this).val();
    if (valLength > 2) {
      // $(".search-wrap").slideDown();
      $(".search-preloader").css("transform", "scaleY(1)");
      service.send(
        JSON.stringify({
          action: "get_branches",
          payload: {
            limit: 200,
            offset: 0,
            search: text
          }
        })
      );
    } else {
      $(".search-preloader").css("transform", "scaleY(0)");
      $(".search-wrap").slideUp();
      $(".table-main-block").css("opacity", 1);
      $(".pagination-wrap").css("opacity", 1);
    }
  });

  // the functions

  function whiteThemeFunction() {
    localStorage.setItem("theme", "whtie");
    root.style.setProperty("--main-panel-color", "#fff");
    root.style.setProperty("--main-text-color", "#333");
    root.style.setProperty("--main-panel-text-color", "#334151");
    root.style.setProperty("--main-panel-text-hover-color", "#f00");
    root.style.setProperty("--main-table-color", "#e7e7e7");
    root.style.setProperty("--main-logo-one", "block");
    root.style.setProperty("--main-logo-two", "none");
    root.style.setProperty("--main-svg-color", "#334151");
    root.style.setProperty("--main-table-header-border", "#e7e7e7");
    root.style.setProperty("--main-table-text-color", "#334151");
  }
  function darkThemeFunction() {
    localStorage.setItem("theme", "dark");
    root.style.setProperty("--main-panel-color", "#333");
    root.style.setProperty("--main-text-color", "#334151");
    root.style.setProperty("--main-panel-text-color", "#fff");
    root.style.setProperty("--main-panel-text-hover-color", "#ff0");
    root.style.setProperty("--main-table-color", "#a4b0be");
    root.style.setProperty("--main-logo-one", "none");
    root.style.setProperty("--main-logo-two", "block");
    root.style.setProperty("--main-svg-color", "#fff");
    root.style.setProperty("--main-table-header-border", "#333");
    root.style.setProperty("--main-table-text-color", "#fff");
  }
  function coloredThemeFunction() {
    localStorage.setItem("theme", "colored");
    root.style.setProperty("--main-panel-color", "#692f81");
    root.style.setProperty("--main-text-color", "#333");
    root.style.setProperty("--main-panel-text-color", "#fff");
    root.style.setProperty("--main-panel-text-hover-color", "#ff0");
    root.style.setProperty("--main-table-color", "#c6aecd");
    root.style.setProperty("--main-logo-one", "none");
    root.style.setProperty("--main-logo-two", "block");
    root.style.setProperty("--main-svg-color", "#fff");
    root.style.setProperty("--main-table-header-border", "#692f81");
    root.style.setProperty("--main-table-text-color", "#fff");
  }
  function primeThemeFunction() {
    localStorage.setItem("theme", "prime");
    root.style.setProperty("--main-panel-color", "#696969");
    root.style.setProperty("--main-text-color", "#333");
    root.style.setProperty("--main-panel-text-color", "#fff");
    root.style.setProperty("--main-panel-text-hover-color", "#ff0");
    root.style.setProperty("--main-table-color", "#ff7f50");
    root.style.setProperty("--main-logo-one", "none");
    root.style.setProperty("--main-logo-two", "block");
    root.style.setProperty("--main-svg-color", "#fff");
    root.style.setProperty("--main-table-header-border", "#696969");
    root.style.setProperty("--main-table-text-color", "#fff");
  }

  let whiteTheme = document.getElementById("theme-white"),
    darkTheme = document.getElementById("theme-dark"),
    coloredTheme = document.getElementById("theme-colored"),
    primeTheme = document.getElementById("theme-prime");
  let root = document.documentElement;
  whiteTheme.addEventListener("click", whiteThemeFunction);
  darkTheme.addEventListener("click", darkThemeFunction);
  coloredTheme.addEventListener("click", coloredThemeFunction);
  primeTheme.addEventListener("click", primeThemeFunction);

  function setSelectedTheme() {
    const theme = localStorage.getItem("theme");
    switch (theme) {
      case "whtie": {
        whiteThemeFunction();
        break;
      }
      case "dark": {
        darkThemeFunction();
        break;
      }
      case "colored": {
        coloredThemeFunction();
        break;
      }
      case "prime": {
        primeThemeFunction();
        break;
      }
      default: {
        darkThemeFunction();
      }
    }
  }
  setSelectedTheme();

  $(document).on("change", "#pagination-select", function() {
    limit = parseInt($(this).val());
    firstLoad = false;
    $(".preloader-fetch").css("display", "flex");
    service.send(
      JSON.stringify({
        action: "get_branches",
        payload: {
          limit: limit,
          offset: 0,
          search: ""
        }
      })
    );
  });

});
