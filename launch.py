#!/usr/bin/python3
import os
import time
from datetime import datetime

root = os.path.dirname(os.path.realpath(__file__))
CRASH_LOG_DIR = os.path.join(root, "crash_logs")
PACKAGE = os.path.join(root, "package.json")

def main():
    dotenv_exists()
    update()
    remove_crash_logs()
    compile()

    iter = 0

    print("-- launching bot --")
    while True:
        exit_code = os.system(f"node .")
        
        if exit_code == 0:
            print("-- bot stopped --")
            print("-- waiting to update bot... --")
            print("-- ^C to stop --")
            time.sleep(5)
            update()
            compile()
        else:
            current_time = datetime.now().strftime("%Y-%m-%d - %H:%M:%S")
            crash_log = f"stopped at: {current_time}\nexit code: {exit_code}\n"
            print("\n---\n\n" + crash_log + "\n---\n")
            with open(f"{CRASH_LOG_DIR}/crash{iter}.log", "w") as f:
                f.write(crash_log)
            
            iter += 1
        
        print("-- waiting to restart bot... --")
        print("-- ^C to stop --")
        time.sleep(5)       # wait 5 seconds before restarting
        print("-- restarting bot... --")

def dotenv_exists():
    dotenv_path = os.path.join(root, ".env")
    if not os.path.exists(dotenv_path):
        with open(dotenv_path, "w") as f:
            f.write("")
        print("-- .ENV FILE MISSING --")
        print("Plese put your bot's token and the owner's user ID into the '.env' file")
        exit(41)

def remove_crash_logs():
    if not os.path.exists(CRASH_LOG_DIR):
        os.mkdir(CRASH_LOG_DIR)
    
    for filename in os.listdir(CRASH_LOG_DIR):
        file = os.path.join(CRASH_LOG_DIR, filename)
        os.remove(file)

def compile():
    print("-- compiling... --")
    tsc_path = os.path.join(root, "node_modules", "typescript", "bin", "tsc")
    tsc_exit_code = os.system(f"{tsc_path} -p {root}")
    if tsc_exit_code != 0:
        print(f"tsc stopped with a non-zero exit code ({tsc_exit_code})")
        exit(1)
    print("-- compile successful --")

def update():
    # kinda sucks... But it works, at least
    print("-- updating... --")
    original_dir = os.getcwd()
    os.chdir(root)
    pull_exit_code = os.system("git pull")
    if pull_exit_code != 0:
        print(f"git pull stopped with a non-zero exit code ({pull_exit_code})")
        print("-- skipping update --")
        return
    os.chdir(original_dir)
    print("-- update successful --")

if __name__ == "__main__":
    main()
