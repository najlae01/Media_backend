import userModel from '../Models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// get all users
export const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find()
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc
      return otherDetails
    })
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

// get a user
export const getUser = async (req, res) => {
  const id = req.params.id

  try {
    const user = await userModel.findById(id)

    if (user) {
      const { password, ...otherDetails } = user._doc
      res.status(200).json(otherDetails)
    } else {
      res.status(404).json('No such user exists')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

// update a user
export const updateUser = async (req, res) => {
  const id = req.params.id
  console.log('req params id' + id)
  const { _id, currentUserAdminStatus, password } = req.body
  console.log('req body id' + _id)
  //if(id === currentUserId || currentUserAdminStatus)
  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(password, salt)
      }

      const user = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      })

      /*const token = jwt.sign(
        { username: user, id: user._id },
        process.env.Vercel_JWT_KEY,
        { expiresIn: '1h' }
      )*/

      res.status(200).json({ user, token })
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    res.status(403).json('Access Denied! You can only update your own profile.')
  }
}

// delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id
  const { currentUserId, currentUserAdminStatus } = req.body
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await userModel.findByIdAndDelete(id)
      res.status(200).json('User deleted Successfully')
    } catch (error) {
      res
        .status(500)
        .json('Access Denied! You can only update your own account.')
    }
  }
}

// follow a user
export const followUser = async (req, res) => {
  const id = req.params.id

  const { _id } = req.body

  if (_id === id) {
    res.status(403).json('Action Forbidden')
  } else {
    try {
      const followUser = await userModel.findById(id)
      const followingUser = await userModel.findById(_id)

      if (!followUser || !followingUser) {
        return res.status(404).json('User not found')
      }

      if (
        !followUser.followers.includes(_id) &&
        !followingUser.following.includes(id)
      ) {
        followUser.followers.push(_id) // Add the follower ID to the followers array
        followingUser.following.push(id) // Add the followed user ID to the following array

        await followUser.save() // Save the updates to the database
        await followingUser.save() // Save the updates to the database
        res.status(200).json('User Followed!')
      } else {
        res.status(403).json('Already followed.')
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const id = req.params.id

  const { _id } = req.body

  if (_id === id) {
    res.status(403).json('Action Forbidden')
  } else {
    try {
      const followUser = await userModel.findById(id)
      const followingUser = await userModel.findById(_id)

      if (!followUser || !followingUser) {
        return res.status(404).json('User not found')
      }

      if (
        followUser.followers.includes(_id) &&
        followingUser.following.includes(id)
      ) {
        followUser.followers.pull(_id) // Remove the follower ID from the followers array
        followingUser.following.pull(id) // Remove the followed user ID from the following array

        await followUser.save() // Save the updates to the database
        await followingUser.save() // Save the updates to the database

        res.status(200).json('User Unfollowed!')
      } else {
        res.status(403).json('Not followed.')
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}
