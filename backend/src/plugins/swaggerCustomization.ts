declare global {
  interface Window {
    initialLoaded: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ui: any;
  }
}

function customSwagger() {
  const schemas = [
    {
      name: "All Apis",
      schema: "json",
    },
    {
      name: "Auth For All Apis",
      schema: "auth",
    },
    {
      name: "Admin Apis",
      schema: "admin",
    },
    {
      name: "Upload Api",
      schema: "upload",
    },
  ];

  // @ts-expect-error the type is unknown
  const store = ui.getSystem().getStore();

  // @ts-expect-error the type is unknown
  window.ui = ui;

  function authorize(accessToken: string) {
    store.dispatch({
      type: "authorize",
      payload: {
        bearerAuth: {
          name: "bearerAuth",
          schema: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
          value: accessToken,
        },
      },
    });
  }

  const custom_reserver_access_token = localStorage.getItem("custom_reserver_access_token");
  if (custom_reserver_access_token) {
    authorize(custom_reserver_access_token);
  }

  let lastAccessTokenDate: Date | null = null;
  store.subscribe(() => {
    const state = store.getState();
    const requests = state.getIn(["spec", "responses"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requests?.forEach((request: any, key: any) => {
      if (
        key === "/auth/login/" &&
        (!lastAccessTokenDate || new Date().getTime() - lastAccessTokenDate.getTime() > 1000 * 10)
      ) {
        lastAccessTokenDate = new Date();
        const reqData = request.toJS();
        if (reqData?.post?.body?.accessToken) {
          localStorage.setItem("custom_reserver_access_token", reqData.post.body.accessToken);
          authorize(reqData.post.body.accessToken);
        }
      }
    });
  });

  function selectNewUrl(url: string) {
    // @ts-expect-error the type is unknown
    ui.specActions.download(window.location.origin + window.location.pathname + "/" + url);
    setTimeout(() => {
      try {
        const decodedUrl = decodeURI(window.location.hash);
        const elementQuery =
          decodedUrl.split("/").length === 3
            ? decodeURI(window.location.hash)
                .replace("#/", "#operations-")
                .replace("/", "-")
                // @ts-expect-error the type is unknown
                .replaceAll(" ", "_")
            : decodeURI(window.location.hash)
                .replace("#/", "#operations-tag-")
                .replace("/", "-")
                // @ts-expect-error the type is unknown
                .replaceAll(" ", "_");
        const element = document.querySelector(elementQuery);
        // @ts-expect-error the type is unknown
        ui.layoutActions.scrollToElement(element);
      } catch (error) {
        console.error(error);
      }
    }, 1000);
  }

  const SavedScheme = localStorage.getItem("scheme");
  if (SavedScheme && SavedScheme !== "json" && window.initialLoaded !== SavedScheme) {
    window.initialLoaded = SavedScheme;
    selectNewUrl(SavedScheme);
  }

  function RenderChangeSchema() {
    const schemeContainer = document.querySelector(".scheme-container section");
    const select = document.createElement("select");
    const selectedOption = localStorage.getItem("scheme") || "json";
    select.value = selectedOption;
    select.classList.add("scheme-selector");
    select.addEventListener("change", (e) => {
      const selectedValue = (e.target as HTMLSelectElement).value;
      localStorage.setItem("scheme", selectedValue);
      selectNewUrl(selectedValue);
    });
    schemas.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.schema;
      optionElement.textContent = option.name;
      if (option.schema === selectedOption) {
        optionElement.selected = true;
      }
      select.appendChild(optionElement);
    });
    schemeContainer?.appendChild(select);
    // @ts-expect-error the type is unknown
    schemeContainer?.style.justifyContent = "space-between";
  }
  RenderChangeSchema();
}

export default customSwagger;
