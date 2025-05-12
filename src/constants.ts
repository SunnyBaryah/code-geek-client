export interface BOILERPLATE {
  problem_id: number;
  langs: string[];
}
export const BOILERPLATES: BOILERPLATE[] = [
  {
    problem_id: 1,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nint addTwoNumbers(int &a, int &b){\n    //type your code here\n}\nint main(){\n    int a, b;\n    cin>>a>>b;\n    cout<<addTwoNumbers(a, b);\n}`,
      `const input=require('fs').readFileSync('/dev/stdin').toString().trim();\nconst [a, b]=input.split(" ").map(Number);\nfunction addTwoNumbers(a, b){\n    //type your code here\n}\nconsole.log(addTwoNumbers(a, b));`,
      `import sys\ninput = sys.stdin.read().strip()\na, b = map(int, input.split(" "))\ndef add_two_numbers(a, b):    \n    #type your code here    \n    pass\nprint(add_two_numbers(a, b))`,
    ],
  },
  {
    problem_id: 2,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nint findMaximum(vector<int>&arr){\n    //type your code here\n}\nint main(){\n    int n;\n    cin>>n;\n    vector<int>arr;\n    for(int i=0; i<n; i++){\n        int a;\n        cin>>a;\n        arr.push_back(a);\n    }\n    cout<<findMaximum(arr);\n}`,
      `const input=require('fs').readFileSync('/dev/stdin').toString().trim();\nconst arr=input.split(" ").map(Number);arr.shift();\nfunction findMaximum(array){\n    //type your code here\n}\nconsole.log(findMaximum(arr));`,
      `import sys\ninput = sys.stdin.read().strip()\narr = list(map(int, input.split(" ")))\n\narr.pop(0)\n\ndef find_maximum(array):\n    # type your code here\n    pass\n\nprint(find_maximum(arr))`,
    ],
  },
  {
    problem_id: 3,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nstring reverseWordsInString(string &s){\n    //type your code here\n}\nint main(){\n    string s;\n    getline(cin, s);\n    string ans=reverseWordsInString(s);\n    int n=ans.size();\n    for(int i=0; i<n; i++){\n        cout<<ans[i];\n    }\n}`,
      `const input=require('fs').readFileSync('/dev/stdin').toString().trim();\nfunction reverseWordsInString(str){\n    //type your code here\n}\nconsole.log(reverseWordsInString(input));`,
      `import sys\ninput = sys.stdin.read().strip()\ndef reverseWordsInString(s):\n    # type your code here\n    pass\nprint(reverseWordsInString(input))`,
    ],
  },
  {
    problem_id: 4,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nint countDuplicates(vector<int>&arr){\n    //type your code here\n}\nint main(){\n    int n;\n    cin>>n;\n    vector<int>arr;\n    for(int i=0; i<n; i++){\n        int a;\n        cin>>a;\n        arr.push_back(a);\n    }\n    cout<<countDuplicates(arr);\n}`,
      `const input=require('fs').readFileSync('/dev/stdin').toString().trim();\nconst arr=input.split(" ").map(Number);arr.shift();\nfunction countDuplicates(array){\n    //type your code here\n}\nconsole.log(countDuplicates(arr));`,
      `import sys\ninput = sys.stdin.read().strip()\narr = list(map(int, input.split(" ")))\n\narr.pop(0)\n\ndef countDuplicates(array):\n    # type your code here\n    pass\n\nprint(countDuplicates(arr))`,
    ],
  },
  {
    problem_id: 5,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nint findSecondLargest(vector<int>&arr){\n    //type your code here\n}\nint main(){\n    int n;\n    cin>>n;\n    vector<int>arr;\n    for(int i=0; i<n; i++){\n        int a;\n        cin>>a;\n        arr.push_back(a);\n    }\n    cout<<findSecondLargest(arr);\n}`,
      `const input=require('fs').readFileSync('/dev/stdin').toString().trim();\nconst arr=input.split(" ").map(Number);arr.shift();\nfunction findSecondLargest(array){\n    //type your code here\n}\nconsole.log(findSecondLargest(arr));`,
      `import sys\ninput = sys.stdin.read().strip()\narr = list(map(int, input.split(" ")))\n\narr.pop(0)\n\ndef findSecondLargest(array):\n    # type your code here\n    pass\n\nprint(findSecondLargest(arr))`,
    ],
  },
  {
    problem_id: 6,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nint longestIncreasingSubsequence(vector<int>&arr){\n    //type your code here\n}\nint main(){\n    int n;\n    cin>>n;\n    vector<int>arr;\n    for(int i=0; i<n; i++){\n        int a;\n        cin>>a;\n        arr.push_back(a);\n    }\n    cout<<longestIncreasingSubsequence(arr);\n}`,
      `const input=require('fs').readFileSync('/dev/stdin').toString().trim();\nconst arr=input.split(" ").map(Number);arr.shift();\nfunction longestIncreasingSubsequence(array){\n    //type your code here\n}\nconsole.log(longestIncreasingSubsequence(arr));`,
      `import sys\ninput = sys.stdin.read().strip()\narr = list(map(int, input.split(" ")))\n\narr.pop(0)\n\ndef longestIncreasingSubsequence(array):\n    # type your code here\n    pass\n\nprint(longestIncreasingSubsequence(arr))`,
    ],
  },
  {
    problem_id: 7,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nstring longestStringRepeatingCharacters(string &s){\n    //type your code here\n}\nint main(){\n    string s;\n    getline(cin, s);\n    string ans=longestStringRepeatingCharacters(s);\n    int n=ans.size();\n    for(int i=0; i<n; i++){\n        cout<<ans[i];\n    }\n}`,
      `const input=require('fs').readFileSync('/dev/stdin').toString().trim();\nfunction longestStringRepeatingCharacters(str){\n    //type your code here\n}\nconsole.log(longestStringRepeatingCharacters(input));`,
      `import sys\ninput = sys.stdin.read().strip()\ndef longestStringRepeatingCharacters(s):\n    # type your code here\n    pass\nprint(longestStringRepeatingCharacters(input))`,
    ],
  },
  {
    problem_id: 8,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nstring longestRepeatingCharacterReplacement(string &s, int &k){\n    //type your code here\n}\nint main(){\n    string s;\n    getline(cin, s);\n    int n=s.size();\n    string str=\"\";\n    string temp=\"\";\n    for(auto c:s){\n        if(c==' '){\n            str=temp;\n            temp=\"\";\n        }else{\n            temp+=c;\n        }\n    }\n    int k=stoi(temp);\n    string ans=longestRepeatingCharacterReplacement(str, k);\n    int n=ans.size();\n    for(int i=0; i<n; i++){\n        cout<<ans[i];\n    }\n}`,
      `const input = require('fs').readFileSync('/dev/stdin').toString().trim();\nconst parts = input.split(' ');\nconst k = parseInt(parts.pop());\nconst str = parts.join(' ');\nfunction longestRepeatingCharacterReplacement(s, k) {\n    // type your code here\n}\nconsole.log(longestRepeatingCharacterReplacement(str, k));`,
      `import sys\ninput_str = sys.stdin.read().strip()\nparts = input_str.split()\nk = int(parts[-1])\ns = ' '.join(parts[:-1])\ndef longestRepeatingCharacterReplacement(s, k):\n    # type your code here\n    pass\nprint(longestRepeatingCharacterReplacement(s, k))`,
    ],
  },
  {
    problem_id: 9,
    langs: [
      `#include<bits/stdc++.h>\nusing namespace std;\nvector<int> topKFrequentElements(vector<int> &arr, int &k){\n    //type your code here\n}\nint main(){\n    string s;\n    getline(cin, s);\n    int n=s.size();\n    vector<int>arr;\n    int num;\n    string temp=\"\";\n    for(auto c:s){\n        if(c==' '){\n            num=stoi(temp);\n            arr.push_back(num);\n            temp=\"\";\n        }else{\n            temp+=c;\n        }\n    }\n    int k=stoi(temp);\n    vector<int> ans=topKFrequentElements(arr, k);\n    sort(ans.begin(), ans.end());\n    int n=ans.size();\n    for(int i=0; i<n; i++){\n        cout<<ans[i];\n        if(i!=n-1)cout<<\" \";\n    }\n}`,
      `const input = require('fs').readFileSync('/dev/stdin').toString().trim();\nconst parts = input.split(' ').map(Number);\nconst k = parts.pop();\nconst arr = parts;\nfunction topKFrequentElements(arr, k) {\n    // type your code here\n}\nconst result = topKFrequentElements(arr, k).sort((a, b) => a - b);\nconsole.log(result.join(' '));`,
      `import sys\ninput_str = sys.stdin.read().strip()\nparts = list(map(int, input_str.split()))\nk = parts[-1]\narr = parts[:-1]\ndef topKFrequentElements(arr, k):\n    # type your code here\n    pass\nans = topKFrequentElements(arr, k)\nans.sort()\nprint(' '.join(map(str, ans)))`,
    ],
  },
];
