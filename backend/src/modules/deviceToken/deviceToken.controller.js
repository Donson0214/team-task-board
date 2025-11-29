const service = require("./deviceToken.service");
const errorHandler = require("../../utils/errorHandler");
const { validate } = require("../../utils/validator");

const { saveTokenSchema } = require("./deviceToken.validation");

module.exports = {
  saveToken: async (req, res) => {
    try {
      const body = validate(saveTokenSchema, req.body);

      const result = await service.saveToken(
        req.user.uid,
        body.token,
        body.platform
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },

  removeToken: async (req, res) => {
    try {
      const result = await service.removeToken(
        req.params.id,
        req.user.uid
      );

      res.json(result);
    } catch (err) {
      errorHandler(res, err);
    }
  },
};
