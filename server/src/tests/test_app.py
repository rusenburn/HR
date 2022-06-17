import unittest
import app

class TestApp(unittest.TestCase):

    def test_a(self):
        self.assertEqual(app.a(5),5)