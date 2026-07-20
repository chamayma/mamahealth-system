# MamaHealth - Postpartum Recovery & Monitoring System

MamaHealth is a premium web application designed to monitor postpartum mothers' health, manage clinical appointments, track prescribed medications, and broadcast alert notifications.

---

## 🏥 Single Hospital Restricting
The application is pre-configured and restricted to **Suza Hospital**. All doctors and mothers profiles are defaulted to this hospital name upon creation, and the field is disabled to prevent data entry inconsistency.

---

## 👥 User Roles & How It Works

### 1. 🤰 Mother (Patient) Workflow
Mothers log into the system to report indicators, track active prescriptions, and view checkup schedules.

*   **Profile Setup:** Upon onboarding, mothers complete their medical file (Date of Birth, Emergency Contact, Address, Delivery Date, and Blood Group). The registered hospital is locked to **Suza Hospital**.
*   **Mother Dashboard (Statistics):** Displays a focused grid of recovery statistics:
    *   *Current Pain Level* (extracted from the latest logged entry).
    *   *Body Temperature* (color-coded based on risk thresholds).
    *   *Medication Compliance* (percentage of completed prescriptions).
    *   *Registered Hospital* (displays "Suza Hospital").
*   **Log Daily Recovery:** Mothers report daily health metrics (Pain level on 1–10 scale, Temperature in °C, Wound condition status, Bleeding level, and optional text remarks) to keep the doctor informed.
*   **Prescriptions & Tracker:** Displays the list of medications prescribed by the assigned doctor, detailing the medication name, dosage, frequency, and active dates.
*   **Clinic Visits & Appointments:** Shows upcoming checkup events. Mothers can view the doctor's name, purpose, date/time, and click a button to **Confirm Attendance** for scheduled appointments.
*   **Broadcast Notifications:** Receives warnings, clinical reminders, and broadcast alerts sent directly by the doctor.

---

### 2. 🩺 Doctor Workflow
Doctors oversee patient recovery records, schedule checkups, prescribe medications, and broadcast critical warning alerts.

*   **Profile Setup:** Defaulted and locked to **Suza Hospital** during onboarding.
*   **Doctor Dashboard:** Provides overview stats on the clinic's activity:
    *   *Total Patients (Mothers)*
    *   *Total Recovery Reports*
    *   *Active Prescriptions*
    *   *Upcoming Checkups*
*   **Mothers (Patient Directory):** Displays a complete directory of registered postpartum mothers. Doctors can select any mother to access her complete medical profile, recovery history records, active medications, and upcoming clinic visits.
*   **Prescribe Medication (with Strictest Validation):**
    *   Doctors can prescribe medications for individual mothers.
    *   *Validation:* Empty fields, whitespace-only entries, and invalid characters are blocked. The start date cannot be in the past, and the end date must be equal to or after the start date.
    *   Backend-returned validation error logs are parsed and formatted into friendly toast alert messages.
*   **Schedule Appointments (with Strictest Validation):**
    *   Doctors can schedule checkup consultations for patients.
    *   *Validation:* The date, time, and purpose are verified. Dates cannot be in the past, and invalid text formats are blocked.
*   **Broadcasting Alerts:** Doctors can broadcast alert messages (warnings, notifications, instruction logs) directly to patients.
*   **Premium SweetAlert2 Dialogs:** Every delete operation (deleting appointments, deactivating doctors, deleting medication prescriptions) requires confirmation through custom styled SweetAlert2 alert panels.

---

### 3. 🔑 Admin Workflow
Administrators manage system users, medical staff listings, analytics, and data reporting profiles.

*   **Admin Dashboard:** Overview of system-wide indicators (Total Doctors, Total Mothers, Total Appointments Scheduled).
*   **Manage Doctors:** View the database list of all active doctors. Admins can edit details, deactivate active doctor profiles, or delete profiles safely. All destructive actions are secured by SweetAlert2 confirmation dialogs.
*   **Mothers List:** View the directory list of all mothers registered in the system. Blood groups (A+, O-, etc.) are formatted as clean, plain text badges.
*   **Analytics Reports:** Fetch system analytics and data reporting summaries.

---

## 🛠️ Technology Stack
*   **Frontend:** React (Vite), Vanilla CSS, Bootstrap 5, React Toastify, SweetAlert2, React Icons
*   **Backend:** Spring Boot, Spring Security (JWT), Hibernate JPA, PostgreSQL
