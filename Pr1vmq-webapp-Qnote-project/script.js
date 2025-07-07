// --- BẮT ĐẦU SCRIPT ---

document.addEventListener("DOMContentLoaded", () => {
  // --- KHAI BÁO BIẾN & LẤY CÁC PHẦN TỬ DOM ---
  let workspaceCounter = 0;
  let workspaceToDelete = null;
  let activeWorkspaceNameForMenu = null;
  let wasMainModalOpen = false;

  // DOM Elements
  const sidebar = document.getElementById("mySidebar");
  const mainContent = document.getElementById("main");
  const menuToggle = document.getElementById("menu-toggle");
  const mainActionsContainer = document.getElementById("sidebar-main-actions");
  const btnToggleEditMode = document.getElementById("btn-toggle-edit-mode");
  const scrollArea = document.querySelector(".sidebar-scroll-area");
  const welcomeElement = document.getElementById("welcome-message");
  const createModal = document.getElementById("create-modal");
  const modalContent = document.getElementById("modal-content");
  const fabCreateNewBtn = document.getElementById("fab-create-new");
  const closeModalBtn = createModal.querySelector(".close-modal-btn");
  const modalTitle = createModal.querySelector("#modal-title");
  const modalGrid = createModal.querySelector("#modal-options-grid");
  const featurePanel = document.getElementById("modal-feature-panel");
  const featurePanelTitle = document.getElementById("feature-panel-title");
  const featurePanelContent = document.getElementById("feature-panel-content");
  const closeFeaturePanelBtn = featurePanel.querySelector(
    ".close-feature-panel-btn"
  );
  const alertModal = document.getElementById("alert-modal");
  const alertTitle = document.getElementById("alert-title");
  const alertBody = document.getElementById("alert-body");
  const alertFooter = document.getElementById("alert-footer");
  const workspaceContextMenu = document.getElementById(
    "workspace-context-menu"
  );

  // --- CÁC HÀM CHỨC NĂNG ---

  function toggleNav() {
    if (!sidebar || !mainContent || !menuToggle) return;
    menuToggle.classList.toggle("active");
    sidebar.style.left = menuToggle.classList.contains("active")
      ? "0"
      : "-280px";
    mainContent.style.marginLeft = menuToggle.classList.contains("active")
      ? "280px"
      : "0";
  }

  function attachCollapsibleListeners() {
    const allCollapsibles = document.querySelectorAll(".workspace-header");
    allCollapsibles.forEach((item) => {
      if (item.dataset.listenerAttached) return;
      item.dataset.listenerAttached = "true";
      item.addEventListener("click", function (e) {
        // Sửa lỗi: Thoát sớm nếu click vào checkbox hoặc icon edit
        if (
          e.target.matches(".workspace-checkbox") ||
          e.target.matches(".fa-edit.action-icon")
        ) {
          return;
        }
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight
          ? null
          : content.scrollHeight + "px";
      });
    });
  }

  /** Tạo một workspace mới và chèn vào sidebar */
  function createNewWorkspace() {
    workspaceCounter++;
    const workspaceName = `Workspace ${String(workspaceCounter).padStart(
      2,
      "0"
    )}`;

    // Sửa lại khối HTML ở đây để bao gồm đủ 5 tính năng
    const newWorkspaceHTML = `
    <div class="sidebar-section workspace">
        <div class="workspace-header">
            <input type="checkbox" class="workspace-checkbox">
            <span>${workspaceName}</span>
            <div>
                <i class="fas fa-chevron-right action-icon"></i>
                <i class="fas fa-edit action-icon"></i>
            </div>
        </div>
        <div class="workspace-content">
            <a href="#" class="sidebar-item"><i class="far fa-file-alt"></i><span>Note</span></a>
            <a href="#" class="sidebar-item"><i class="far fa-calendar-alt"></i><span>Calendar</span></a>
            <a href="#" class="sidebar-item"><i class="fas fa-list-check"></i><span>To-do list</span></a>
            <a href="#" class="sidebar-item"><i class="far fa-check-square"></i><span>Task</span></a>
            <a href="#" class="sidebar-item"><i class="fas fa-users"></i><span>Team</span></a>
        </div>
    </div>`;

    const scrollArea = document.querySelector(".sidebar-scroll-area");
    if (scrollArea) {
      scrollArea.insertAdjacentHTML("beforeend", newWorkspaceHTML);
      attachCollapsibleListeners();
      updateMainActionButtons();
    }
  }

  function findWorkspaceHeaderByName(name) {
    const allWorkspaceHeaders = document.querySelectorAll(
      ".sidebar .workspace-header"
    );
    for (const header of allWorkspaceHeaders) {
      const nameSpan = header.querySelector("span");
      if (nameSpan && nameSpan.textContent.trim() === name) return header;
    }
    return null;
  }

  function duplicateWorkspace(workspaceName) {
    const header = findWorkspaceHeaderByName(workspaceName);
    if (!header) return;
    const originalSection = header.closest(".sidebar-section.workspace");
    if (!originalSection) return;

    const clonedSection = originalSection.cloneNode(true);
    const clonedHeader = clonedSection.querySelector(".workspace-header");
    clonedHeader.querySelector(
      "span"
    ).textContent = `${workspaceName} (copied)`;
    clonedHeader.classList.remove("active");
    clonedHeader.removeAttribute("data-listener-attached");
    clonedSection.querySelector(".workspace-content").style.maxHeight = null;

    originalSection.insertAdjacentElement("afterend", clonedSection);
    attachCollapsibleListeners();
    updateMainActionButtons();
  }

  function deleteWorkspace(workspaceName) {
    const header = findWorkspaceHeaderByName(workspaceName);
    if (header) {
      const workspaceSection = header.closest(".sidebar-section.workspace");
      if (workspaceSection) workspaceSection.remove();
      updateMainActionButtons();
    }
  }

  function updateMainActionButtons() {
    if (!sidebar) return;
    const workspaceCount = document.querySelectorAll(
      ".sidebar .workspace"
    ).length;
    sidebar.classList.toggle("has-workspaces", workspaceCount > 0);
  }

  function handleCheckboxChange() {
    if (!btnToggleEditMode) return;
    const checkedCount = document.querySelectorAll(
      ".workspace-checkbox:checked"
    ).length;
    const isDeleteActive = checkedCount > 0;

    btnToggleEditMode.classList.toggle("delete-active", isDeleteActive);
    btnToggleEditMode.dataset.tooltip = isDeleteActive
      ? "Delete selected"
      : "Edit list";
    btnToggleEditMode.innerHTML = isDeleteActive
      ? '<i class="fas fa-trash-alt"></i>'
      : '<i class="fas fa-pencil-alt"></i>';
  }

  function renderWorkspaceListView() {
    if (!modalTitle || !modalGrid) return;
    modalTitle.textContent = "Select Workspace";
    modalGrid.innerHTML = "";
    const newWorkspaceButtonHTML = `<a href="#" class="modal-option" data-type="create_new_ws"><i class="fas fa-plus-circle" style="color: #0077ff;"></i><span>New Workspace</span></a>`;
    modalGrid.insertAdjacentHTML("beforeend", newWorkspaceButtonHTML);
    const existingWorkspaces = document.querySelectorAll(
      ".sidebar .workspace-header"
    );
    existingWorkspaces.forEach((ws) => {
      const workspaceName = ws.querySelector("span").textContent;
      const optionHTML = `<a href="#" class="modal-option" data-type="workspace" data-name="${workspaceName}"><i class="far fa-folder-open"></i><span>${workspaceName}</span></a>`;
      modalGrid.insertAdjacentHTML("beforeend", optionHTML);
    });
  }

  function populateFeaturePanel(workspaceName) {
    if (!featurePanelTitle || !featurePanelContent) return;
    featurePanelTitle.textContent = "Feature";
    const panelContentHTML = `
            <i class="fas fa-chevron-up scroll-indicator top-indicator hidden"></i>
            <i class="fas fa-chevron-down scroll-indicator bottom-indicator hidden"></i>
            <div class="feature-list">
              <a href="#" class="modal-option" data-type="feature" data-name="Note"><i class="far fa-file-alt"></i><span>Note</span></a>
              <a href="#" class="modal-option" data-type="feature" data-name="Calendar"><i class="far fa-calendar-alt"></i><span>Calendar</span></a>
              <a href="#" class="modal-option" data-type="feature" data-name="To-do list"><i class="fas fa-list-check"></i><span>To-do list</span></a>
              <a href="#" class="modal-option" data-type="feature" data-name="Task"><i class="far fa-check-square"></i><span>Task</span></a>
              <a href="#" class="modal-option" data-type="feature" data-name="Team"><i class="fas fa-users"></i><span>Team</span></a>
            </div>
            <div class="feature-actions">
              <a href="#" class="modal-option" data-type="feature" data-name="Setting"><i class="fas fa-cog"></i><span>Setting</span></a>
              <a href="#" class="modal-option action-delete" data-type="feature" data-name="Delete"><i class="fas fa-trash-alt"></i><span>Delete</span></a>
            </div>`;
    featurePanelContent.innerHTML = panelContentHTML;
    featurePanelContent.addEventListener("scroll", () =>
      handleScrollIndicators(featurePanelContent)
    );
    setTimeout(() => handleScrollIndicators(featurePanelContent), 0);
  }

  function handleScrollIndicators(element) {
    if (!featurePanel) return;
    const topIndicator = featurePanel.querySelector(".top-indicator");
    const bottomIndicator = featurePanel.querySelector(".bottom-indicator");
    if (!topIndicator || !bottomIndicator) return;
    const hasScrolled = element.scrollTop > 5;
    const canScrollMore =
      element.scrollHeight > element.clientHeight + element.scrollTop + 5;
    topIndicator.classList.toggle("hidden", !hasScrolled);
    bottomIndicator.classList.toggle("hidden", !canScrollMore);
  }

  function showDeleteConfirmation() {
    if (!alertModal || !alertTitle || !alertBody || !alertFooter) return;
    alertTitle.textContent = "Confirm Deletion";
    alertBody.innerHTML = `<p>Are you sure you want to delete "<strong>${workspaceToDelete}</strong>"? This action cannot be undone.</p>`;
    alertFooter.innerHTML = `<button class="btn-primary" id="alert-cancel-btn">Cancel</button><button class="btn-danger" id="alert-delete-btn">Delete</button>`;
    alertModal.classList.remove("hidden");
  }

  function showPasswordPrompt() {
    if (!alertModal || !alertTitle || !alertBody || !alertFooter) return;
    alertTitle.textContent = "Enter Password";
    alertBody.innerHTML = `<p>To confirm, please enter your password.</p><input type="password" id="password-confirm-input" placeholder="Password">`;
    alertFooter.innerHTML = `<button class="btn-primary" id="alert-back-btn">Back</button><button class="btn-danger" id="alert-confirm-delete-btn">Confirm Delete</button>`;
    document.getElementById("password-confirm-input").focus();
  }

  function closeAlertModal() {
    if (!alertModal) return;
    alertModal.classList.add("hidden");
    if (wasMainModalOpen && createModal) {
      createModal.classList.remove("hidden");
    }
    workspaceToDelete = null;
    wasMainModalOpen = false;
  }

  // --- GÁN CÁC SỰ KIỆN ---

  if (menuToggle) menuToggle.onclick = toggleNav;

  if (mainActionsContainer) {
    mainActionsContainer.addEventListener("click", (e) => {
      const targetButton = e.target.closest(".sidebar-action-btn");
      if (!targetButton) return;
      e.preventDefault();

      const actionId = targetButton.id;

      if (actionId === "btn-add-workspace") {
        createNewWorkspace();
      } else if (actionId === "btn-toggle-edit-mode") {
        if (targetButton.classList.contains("delete-active")) {
          const selectedWorkspaces = [];
          document
            .querySelectorAll(".workspace-checkbox:checked")
            .forEach((cb) => {
              selectedWorkspaces.push(cb.nextElementSibling.textContent);
            });
          alert(
            `(Chức năng đang phát triển) Xóa các workspace: ${selectedWorkspaces.join(
              ", "
            )}`
          );
        } else {
          sidebar.classList.add("is-edit-mode");
        }
      } else if (actionId === "btn-cancel-edit-mode") {
        sidebar.classList.remove("is-edit-mode");
        document
          .querySelectorAll(".workspace-checkbox")
          .forEach((cb) => (cb.checked = false));
        handleCheckboxChange();
      }
    });
  }

  if (scrollArea) {
    scrollArea.addEventListener("change", (e) => {
      if (e.target.matches(".workspace-checkbox")) {
        handleCheckboxChange();
      }
    });

    scrollArea.addEventListener("click", function (e) {
      const editIcon = e.target.closest(".fa-edit.action-icon");
      if (editIcon) {
        e.preventDefault();
        e.stopPropagation();

        const header = editIcon.closest(".workspace-header");
        const newWorkspaceName = header.querySelector("span").textContent;

        // --- LOGIC MỚI ĐỂ ĐÓNG/MỞ ---
        // Nếu menu đang hiện VÀ người dùng nhấn lại vào cùng một nút đã mở nó
        if (
          !workspaceContextMenu.classList.contains("hidden") &&
          activeWorkspaceNameForMenu === newWorkspaceName
        ) {
          workspaceContextMenu.classList.add("hidden"); // Thì đóng menu lại
          return; // Dừng hàm tại đây
        }
        // --- KẾT THÚC LOGIC MỚI ---

        // Logic cũ để mở menu (hoặc chuyển menu sang vị trí mới)
        activeWorkspaceNameForMenu = newWorkspaceName;

        const rect = editIcon.getBoundingClientRect();
        workspaceContextMenu.style.top = `${
          rect.bottom + window.scrollY + 5
        }px`;
        workspaceContextMenu.style.left = `${
          rect.right + window.scrollX - workspaceContextMenu.offsetWidth
        }px`;

        workspaceContextMenu.classList.remove("hidden");
      }
    });
  }

  if (fabCreateNewBtn) {
    fabCreateNewBtn.addEventListener("click", function (e) {
      e.preventDefault();
      renderWorkspaceListView();
      if (createModal) createModal.classList.remove("hidden");
      if (modalContent) modalContent.classList.remove("is-expanded");
    });
  }

  if (modalGrid) {
    modalGrid.addEventListener("click", function (e) {
      const clickedOption = e.target.closest(".modal-option");
      if (!clickedOption) return;
      e.preventDefault();
      const type = clickedOption.dataset.type;
      const name = clickedOption.dataset.name;
      if (type === "workspace") {
        if (clickedOption.classList.contains("active")) {
          modalContent.classList.remove("is-expanded");
          clickedOption.classList.remove("active");
          modalTitle.textContent = "Select Workspace";
          return;
        }
        modalGrid
          .querySelectorAll(".modal-option")
          .forEach((option) => option.classList.remove("active"));
        clickedOption.classList.add("active");
        modalTitle.textContent = `Editing ${name}`;
        populateFeaturePanel(name);
        modalContent.classList.add("is-expanded");
      } else if (type === "create_new_ws") {
        createNewWorkspace();
        renderWorkspaceListView();
      }
    });
  }

  if (featurePanelContent) {
    featurePanelContent.addEventListener("click", function (e) {
      const clickedOption = e.target.closest(".modal-option");
      if (!clickedOption) return;
      e.preventDefault();
      const type = clickedOption.dataset.type;
      const name = clickedOption.dataset.name;
      if (type === "feature" && name === "Delete") {
        const activeWorkspaceName = modalTitle.textContent.replace(
          "Editing ",
          ""
        );
        workspaceToDelete = activeWorkspaceName;
        wasMainModalOpen = true;
        createModal.classList.add("hidden");
        showDeleteConfirmation();
      } else if (type === "feature") {
        console.log(
          `Đã chọn tính năng: ${name} của workspace ${modalTitle.textContent.replace(
            "Editing ",
            ""
          )}`
        );
        createModal.classList.add("hidden");
      }
    });
  }

  if (closeFeaturePanelBtn) {
    closeFeaturePanelBtn.addEventListener("click", function () {
      modalContent.classList.remove("is-expanded");
      const activeOption = modalGrid.querySelector(".modal-option.active");
      if (activeOption) activeOption.classList.remove("active");
      modalTitle.textContent = "Select Workspace";
    });
  }

  if (closeModalBtn)
    closeModalBtn.addEventListener("click", () =>
      createModal.classList.add("hidden")
    );
  if (createModal)
    createModal.addEventListener("click", (e) => {
      if (e.target === createModal) createModal.classList.add("hidden");
    });

  if (alertModal) {
    alertModal.addEventListener("click", function (e) {
      const targetId = e.target.id;
      if (targetId === "alert-cancel-btn" || e.target === alertModal)
        closeAlertModal();
      else if (targetId === "alert-delete-btn") showPasswordPrompt();
      else if (targetId === "alert-back-btn") showDeleteConfirmation();
      else if (targetId === "alert-confirm-delete-btn") {
        const password = document.getElementById(
          "password-confirm-input"
        ).value;
        if (password) {
          deleteWorkspace(workspaceToDelete);
          createModal.classList.add("hidden");
          closeAlertModal();
        } else {
          alert("Password is required!");
        }
      }
    });
  }

  if (workspaceContextMenu) {
    window.addEventListener("click", function (e) {
      if (
        !workspaceContextMenu.contains(e.target) &&
        !e.target.matches(".fa-edit.action-icon")
      ) {
        workspaceContextMenu.classList.add("hidden");
      }
    });
    workspaceContextMenu.addEventListener("click", function (e) {
      const actionLink = e.target.closest("a");
      if (!actionLink) return;
      e.preventDefault();
      const action = actionLink.dataset.action;
      const workspaceName = activeWorkspaceNameForMenu;

      if (action === "rename") {
        const header = findWorkspaceHeaderByName(workspaceName);
        if (!header) return;
        const nameSpan = header.querySelector("span");
        const currentName = nameSpan.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.className = "workspace-rename-input";
        input.value = currentName;
        input.placeholder = currentName;
        const finishRename = () => {
          const newName = input.value.trim() || currentName;
          const newSpan = document.createElement("span");
          newSpan.textContent = newName;
          input.replaceWith(newSpan);
        };
        nameSpan.replaceWith(input);
        input.focus();
        input.select();
        input.addEventListener("blur", finishRename);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") finishRename();
          else if (e.key === "Escape") {
            input.value = currentName;
            finishRename();
          }
        });
      } else if (action === "delete") {
        workspaceToDelete = workspaceName;
        wasMainModalOpen = false;
        showDeleteConfirmation();
      } else if (action === "duplicate") {
        duplicateWorkspace(workspaceName);
      } else {
        console.log(
          `Action: ${action} on Workspace: ${activeWorkspaceNameForMenu}`
        );
      }
      workspaceContextMenu.classList.add("hidden");
    });
  }

  if (welcomeElement) {
    const messages = [
      "Chào mừng trở lại! Một ngày mới, một khởi đầu mới. 🎉",
      "Hôm nay là một ngày tuyệt vời để hoàn thành mọi kế hoạch. Bắt đầu thôi!",
      "Hãy biến ý tưởng thành hành động. Chúc bạn một ngày làm việc hiệu quả! 🚀",
      "Mọi thành công lớn đều bắt đầu từ những bước nhỏ. Ghi chú lại nào!",
      "Đừng để ý tưởng vụt mất. Ghi lại ngay và quản lý thời gian thật tốt nhé! ✍️",
      "Một suy nghĩ rõ ràng bắt đầu từ một ghi chú đơn giản. Cùng bắt đầu nhé!",
      "Hôm nay bạn sẽ tiến gần hơn đến mục tiêu của mình. Hãy lên kế hoạch nào!",
      "Nguồn cảm hứng ở khắp mọi nơi. Đừng quên ghi lại những ý tưởng bất chợt. 💡",
      "Chúc bạn một ngày tràn đầy năng lượng và các kế hoạch được hoàn thành!",
      "Danh sách việc cần làm đang chờ. Cùng nhau chinh phục chúng nào! ✔️",
      "Viết ra là cách tốt nhất để ghi nhớ. Bạn đã sẵn sàng chưa?",
      "Tương lai được xây dựng từ những gì bạn làm hôm nay. Bắt đầu kế hoạch của bạn.",
      "Hoàn thành từng việc nhỏ sẽ tạo nên thành công lớn. Cố lên!",
      "Sự tập trung là chìa khóa. Hãy khởi đầu ngày mới với một mục tiêu rõ ràng.",
      "Có ý tưởng nào mới không? Ghi lại ngay để không bỏ lỡ nhé!",
    ];
    let currentMessageIndex = 0;
    welcomeElement.innerHTML = messages[currentMessageIndex];
    setInterval(() => {
      welcomeElement.classList.add("fade-out");
      setTimeout(() => {
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        welcomeElement.innerHTML = messages[currentMessageIndex];
        welcomeElement.classList.remove("fade-out");
      }, 1000);
    }, 10000);
  }

  // --- KHỞI TẠO BAN ĐẦU ---
  attachCollapsibleListeners();
  updateMainActionButtons();
});

// Khởi tạo hiệu ứng nền
window.addEventListener("load", () => {
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: "#555555" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#888888",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: false, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 180, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }
});
