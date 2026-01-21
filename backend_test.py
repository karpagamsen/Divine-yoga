import requests
import sys
import json
from datetime import datetime

class YogaAppAPITester:
    def __init__(self, base_url="https://yogajourney-17.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text}"
                
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_signup(self):
        """Test user signup"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@yoga.com",
            "password": "password123"
        }
        
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data=test_user
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True, test_user
        return False, {}

    def test_login(self):
        """Test login with existing user"""
        login_data = {
            "email": "annie@yoga.com",
            "password": "password123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_get_trainers(self):
        """Test get trainers"""
        success, response = self.run_test(
            "Get Trainers",
            "GET",
            "trainers",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} trainers")
            return True
        elif success:
            self.log_test("Get Trainers - Data Check", False, "No trainers found")
            return False
        return False

    def test_get_sessions(self):
        """Test get sessions"""
        success, response = self.run_test(
            "Get All Sessions",
            "GET",
            "sessions",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} sessions")
            return True, response
        elif success:
            self.log_test("Get Sessions - Data Check", False, "No sessions found")
            return False, []
        return False, []

    def test_get_sessions_by_category(self):
        """Test get sessions by category"""
        categories = ['Yoga', 'Meditation', 'Sleep']
        
        for category in categories:
            success, response = self.run_test(
                f"Get {category} Sessions",
                "GET",
                f"sessions?category={category}",
                200
            )
            
            if success and isinstance(response, list):
                print(f"   Found {len(response)} {category} sessions")
            else:
                return False
        
        return True

    def test_get_session_detail(self, session_id):
        """Test get session detail"""
        success, response = self.run_test(
            "Get Session Detail",
            "GET",
            f"sessions/{session_id}",
            200
        )
        return success

    def test_get_programs(self):
        """Test get programs"""
        success, response = self.run_test(
            "Get Programs",
            "GET",
            "programs",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} programs")
            return True, response
        elif success:
            self.log_test("Get Programs - Data Check", False, "No programs found")
            return False, []
        return False, []

    def test_get_program_detail(self, program_id):
        """Test get program detail"""
        success, response = self.run_test(
            "Get Program Detail",
            "GET",
            f"programs/{program_id}",
            200
        )
        return success

    def test_get_progress(self):
        """Test get user progress"""
        success, response = self.run_test(
            "Get User Progress",
            "GET",
            "progress",
            200
        )
        return success

    def test_update_progress(self, session_id):
        """Test update progress"""
        progress_data = {
            "session_id": session_id,
            "completed": True,
            "progress_percentage": 100
        }
        
        success, response = self.run_test(
            "Update Progress",
            "POST",
            "progress",
            200,
            data=progress_data
        )
        return success

    def test_seed_data(self):
        """Test seed data endpoint"""
        success, response = self.run_test(
            "Seed Data",
            "POST",
            "seed",
            200
        )
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Yoga App API Tests")
        print("=" * 50)
        
        # Test data seeding first
        print("\n📊 Testing Data Seeding...")
        self.test_seed_data()
        
        # Test authentication
        print("\n🔐 Testing Authentication...")
        signup_success, test_user = self.test_signup()
        
        # Also test login with existing user
        login_success = self.test_login()
        
        if not (signup_success or login_success):
            print("❌ Authentication failed, stopping tests")
            return False
        
        # Test protected endpoint
        self.test_get_me()
        
        # Test content endpoints
        print("\n📚 Testing Content Endpoints...")
        self.test_get_trainers()
        
        sessions_success, sessions = self.test_get_sessions()
        if sessions_success and sessions:
            # Test session detail with first session
            self.test_get_session_detail(sessions[0]['id'])
        
        self.test_get_sessions_by_category()
        
        programs_success, programs = self.test_get_programs()
        if programs_success and programs:
            # Test program detail with first program
            self.test_get_program_detail(programs[0]['id'])
        
        # Test progress endpoints
        print("\n📈 Testing Progress Endpoints...")
        self.test_get_progress()
        
        if sessions_success and sessions:
            self.test_update_progress(sessions[0]['id'])
        
        # Print final results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed")
            return False

def main():
    tester = YogaAppAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
        "test_details": tester.test_results
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())