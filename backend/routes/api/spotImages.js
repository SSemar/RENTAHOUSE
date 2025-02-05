// // backend/routes/api/spot-images.js
// const express = require('express');

// const { requireAuth } = require('../../utils/auth.js');
// const { Spot, SpotImage } = require('../../db/models');

// const router = express.Router();

// // Delete a Spot Image
// router.delete('/:imageId', requireAuth, async (req, res) => {
//   try {
//     const spotImage = await SpotImage.findByPk(req.params.imageId, {
//       include: [
//         {
//           model: Spot,
//         },
//       ],
//     });
//     if (!spotImage) {
//       throw new Error();
//     }

//     const { user } = req;
//     if (user) {
//       try {
//         if (user.id !== spotImage.Spot.ownerId) {
//           throw new Error();
//         }
//       } catch (error) {
//         res.statusCode = 403;
//         return res.json({ message: 'Forbidden' });
//       }

//       await spotImage.destroy();
//       return res.json({ message: 'Successfully deleted' });
//     } else {
//       return res.json({ user: null });
//     }
//   } catch (error) {
//     res.statusCode = 404;
//     return res.json({ message: "Spot Image couldn't be found" });
//   }
// });

// module.exports = router;




const express = require('express');

const { requireAuth } = require('../../utils/auth.js');
const { Spot, SpotImage } = require('../../db/models');

const router = express.Router();

// Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
  try {
    const spotImage = await SpotImage.findByPk(req.params.imageId, {
      include: [
        {
          model: Spot,
        },
      ],
    });
    if (!spotImage) {
      throw new Error();
    }

    const { user } = req;
    if (user) {
      try {
        if (user.id !== spotImage.Spot.ownerId) {
          throw new Error();
        }
      } catch (error) {
        res.statusCode = 403;
        return res.json({ message: 'Forbidden' });
      }

      await spotImage.destroy();
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ user: null });
    }
  } catch (error) {
    res.statusCode = 404;
    return res.json({ message: "Spot Image couldn't be found" });
  }
});

module.exports = router;