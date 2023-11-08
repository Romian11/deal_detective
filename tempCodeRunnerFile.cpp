#include<bits/stdc++.h>
using namespace std;
class human{
    public:

   virtual int setage(int age)=0;

};

class male : public human{
    public:
    int age = 0;
    int setage(int age){
      this->age = age;
    }
};


int main()
{
  male a;
  a.setage(16);
  cout<<a.age;
return 0;
} 