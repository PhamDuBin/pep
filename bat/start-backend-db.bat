@echo off
REM Start local Supabase database
REM ローカルSupabaseデータベース起動

cd /d "%~dp0.."
supabase start
pause
