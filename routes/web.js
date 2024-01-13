import express from 'express';

import PagesController from '../app/controller/pages';
import AdminController from '../app/controller/admin';
import APIController from '../app/controller/api';

import AuthMiddleware from '../app/middleware/Auth';
import AuthAPI from '../app/middleware/AuthAPI';

import Admin from '../app/middleware/Admin';
import AdminAPI from '../app/middleware/AdminAPI';

import Login from '../app/middleware/Login';
import LoginAPI from '../app/middleware/LoginAPI';

const router = express.Router();

// users
router.get('/', AuthMiddleware,PagesController.GetHome);
router.get('/account/setting', AuthMiddleware,PagesController.STAccount);
router.get('/account/class', AuthMiddleware,PagesController.MyClass);
router.get('/account/class/add', AuthMiddleware,PagesController.AddClass);
router.get('/account/class/:id/jobs', AuthMiddleware,PagesController.ListJobs);

router.get('/manager/account/student', Admin,AdminController.ListStudent);
router.get('/manager/account/teacher', Admin,AdminController.ListTeacher);
router.get('/manager/class/create', AuthMiddleware,AdminController.CreateClass);
router.get('/manager/class/list', AuthMiddleware,AdminController.ListClass);
router.get('/manager/jobs/list', AuthMiddleware,AdminController.ListJobs);
router.get('/manager/jobs/create', AuthMiddleware,AdminController.CreateJobs);

router.get('/manager/class/:id/edit', AuthMiddleware,AdminController.EditClass);
router.get('/manager/account/:id/edit', AdminAPI,AdminController.EditUser);
router.get('/manager/jobs/:id/edit', AuthMiddleware,AdminController.EditJobs);


router.get('/auth/login',Login, PagesController.GetLogin);
router.get('/auth/register',Login, PagesController.GetRegister);
router.get('/logout',AuthMiddleware, APIController.GetLogout);


router.post('/api/account/change-info',AuthAPI, APIController.UpInfo);
router.post('/api/account/change-password',AuthAPI, APIController.UpPass);
router.post('/api/account/class/add',AuthAPI, APIController.ADDClass);

router.post('/api/manager/jobs/:id/edit',AuthAPI, APIController.AdminEditJobs);
router.get('/api/manager/jobs/:id/delete',AuthAPI, APIController.AdminDeleteJobs);

router.post('/api/manager/class/:id/edit',AuthAPI, APIController.AdminEditClass);
router.get('/api/manager/class/:id/delete',AuthAPI, APIController.AdminDeleteClass);

router.post('/api/manager/account/:id/edit',AdminAPI, APIController.AdminUPUser);
router.get('/api/manager/account/:id/delete',AdminAPI, APIController.AdminDeleteUser);

router.post('/api/manager/class/create',AuthAPI, APIController.AdminCreateClass);
router.post('/api/manager/jobs/create',AuthAPI, APIController.AdminCreateJobs);

router.get('/api/account/class/:id/out',AuthAPI, APIController.OutClass);

router.post('/api/register',LoginAPI, APIController.GetRegister);
router.post('/api/login',LoginAPI, APIController.GetLogin);
module.exports=router;

