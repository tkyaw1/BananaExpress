import sys
import json

def main():
    arg1 = sys.argv[1]
    print(arg1['keyword'])
    print('Hello World!')
    sys.stdout.flush()

if __name__ == '__main__':
    main()