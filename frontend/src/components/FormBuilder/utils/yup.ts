import * as Yup from "yup";

Yup.addMethod(
  Yup.string,
  "arabicOnly",
  function (message?: string, overRide?: boolean) {
    return this.test({
      name: "arabicOnly",
      message: message || "don't accept english letters",
      test: (value) => {
        if (overRide) return true;
        if (!value) return true; // allow empty values
        return !/([a-z|A-Z])+/.test(value);
      },
    });
  }
);

Yup.addMethod(
  Yup.string,
  "englishOnly",
  function (message?: string, overRide?: boolean) {
    return this.test({
      name: "englishOnly",
      message: message || "don't accept arabic letters",
      test: (value) => {
        if (overRide) return true;
        if (!value) return true; // allow empty values
        return !/([\u0621-\u064A])+/.test(value);
      },
    });
  }
);

Yup.addMethod(Yup.string, "numbersOnly", function (message?: string) {
  return this.test({
    name: "numbersOnly",
    message: message || "Can't enter letters",
    test: (value) => {
      if (!value) return true; // allow empty values
      return /^\d+$/.test(value);
    },
  });
});

Yup.addMethod(Yup.string, "passwordMinLength", function (message?: string) {
  return this.test({
    name: "passwordMinLength",
    message: message || "MinLength8",
    test: (value) => {
      if (!value) return true;
      return value.length >= 8;
    },
  });
});

/**
 * Adds a custom validation method to Yup for checking if a string contains only letters.
 */
Yup.addMethod(Yup.string, "lettersOnly", function (message?: string) {
  return this.test({
    name: "lettersOnly",
    message: message || "It must contain only letters",
    /**
     * The test function to check if the value contains only letters.
     */
    test: (value) => {
      if (!value) return true; // allow empty values
      return /^[^\p{P}\p{S}]+$/u.test(value);
    },
  });
});

const URL_REGEX =
  /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
Yup.addMethod(Yup.string, "url", function (message?: string) {
  return this.test({
    name: "url",
    message: message || "invalid url",
    test: (value) => {
      if (!value) return true; // allow empty values
      return URL_REGEX.test(value);
    },
  });
});
export default Yup;
