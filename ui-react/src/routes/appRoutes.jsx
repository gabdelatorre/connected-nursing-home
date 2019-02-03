import Registration from "../views/Registration";
import Login from "../views/Login";
import EmployeeDashboard from "../views/EmployeeDashboard";
import NursingHomeDashboard from "../views/NursingHomeDashboard";
import RelativeDashboard from "../views/RelativeDashboard";
import PatientDashboard from "../views/PatientDashboard";

const appRoutes = [
  { path: "/login", name: "login", title: "Login", component: Login },
  {
    path: "/registration",
    name: "registration",
    title: "Registration",
    component: Registration
  },
  {
    path: "/edashboard",
    name: "edashboard",
    title: "My Dashboard",
    component: EmployeeDashboard
  },
  {
    path: "/nhdashboard",
    name: "nhdashboard",
    title: "Nursing Home Dashboard",
    component: NursingHomeDashboard
  },
  {
    path: "/rdashboard",
    name: "rdashboard",
    title: "My Dashboard",
    component: RelativeDashboard
  },
  {
    path: "/pdashboard",
    name: "pdashboard",
    title: "Patient Dashboard",
    component: PatientDashboard
  }
];

export default appRoutes;
