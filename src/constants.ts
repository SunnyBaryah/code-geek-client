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
];
