## default link: http://localhost:6000

APIs

1. User: '/users'

-Methods: POST

Forget password: '/forget-password'
-input: email

Register: '/register'
-input: email, phone, password, firstName, lastName, gender

Login: '/login'
-input: email, password

---

-Methods: GET

Get all users: '/?'
Get user by id: '/:id'

-Methods: PUT

Reset password: '/reset-password/:token'
-input: newPassword

Update user by id: '/:id'
-input: password, newPassword, firstName, lastName, gender, address, dateOfBirth, file

Change user role by id: 'change-role/:id'
-input: role

---

-Methods: DELETE
Delete user by id: '/:id'
